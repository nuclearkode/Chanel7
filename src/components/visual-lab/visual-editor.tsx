"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { SidebarComponent } from './sidebar'
import { InspectorComponent } from './inspector'
import { NodeComponent } from './node'
import { ConnectionComponent } from './connection'
import { AccordGroupComponent } from './group'
import { VisualNode, Connection, NodeType, AccordGroup } from './types'
import { Ingredient, VisualNodeMeta, VisualConnection, VisualGroup } from "@/lib/types"
import { usePerfume } from "@/lib/store"
import { v4 as uuidv4 } from 'uuid'
import { Plus, Minus, MousePointer2, Move, LayoutGrid, Layers, Archive, BoxSelect, Maximize, WandSparkles } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NODE_DIMENSIONS } from './constants'

export function VisualEditor() {
  const { state, dispatch } = usePerfume()
  const { activeFormula } = state

  // Local state for smooth interaction (synced from store)
  const [nodes, setNodes] = useState<VisualNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [groups, setGroups] = useState<AccordGroup[]>([])

  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  // Canvas State
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)

  // Dragging Node State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)

  // Connecting State
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null)
  const [tempConnectionEnd, setTempConnectionEnd] = useState<{ x: number, y: number } | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  // --- Synchronization Logic ---

  // Commit local state to global store
  const commitLayout = useCallback((currentNodes: VisualNode[], currentConns: Connection[], currentGroups: AccordGroup[]) => {
      const metaNodes: VisualNodeMeta[] = currentNodes.map(n => ({
          id: n.id,
          ingredientId: n.data.ingredient?.id,
          type: n.type as any, // 'ingredient' | 'accord' | 'output'
          position: n.position,
          label: n.data.label,
          color: n.data.color,
          description: n.data.description,
          children: n.data.items?.map(i => i.id) // For accords
      }))

      const metaConns: VisualConnection[] = currentConns.map(c => ({
          id: c.id,
          source: c.source,
          target: c.target,
          type: c.type || 'blend',
          strength: c.strength || 0.5
      }))

      const metaGroups: VisualGroup[] = currentGroups.map(g => ({
          id: g.id,
          label: g.label,
          nodeIds: g.nodeIds,
          color: g.color
      }))

      dispatch({
          type: "UPDATE_VISUAL_LAYOUT",
          payload: {
              nodes: metaNodes,
              connections: metaConns,
              groups: metaGroups
          }
      })
  }, [dispatch])

  // Sync Store -> Local State
  useEffect(() => {
      if (draggingNodeId) return // Don't interrupt dragging

      const formulaItems = activeFormula.items || []
      const layout = activeFormula.visualLayout || { nodes: [], connections: [], groups: [] }

      const newNodes: VisualNode[] = []

      // 1. Map existing layout nodes
      layout.nodes.forEach(meta => {
          if (meta.type === 'ingredient' && meta.ingredientId) {
              const item = formulaItems.find(i => i.ingredient.id === meta.ingredientId)
              if (item) {
                  const concentration = (item.amount / (activeFormula.targetTotal || 100)) * 100
                  newNodes.push({
                      id: meta.id,
                      type: 'ingredient',
                      data: {
                          ingredient: item.ingredient,
                          label: meta.label || item.ingredient.name,
                          concentration,
                          color: meta.color || 'bg-primary',
                          description: meta.description || item.ingredient.description
                      },
                      position: meta.position
                  })
              }
              // If item not found, skip (it was removed from formula)
          } else if (meta.type === 'accord') {
             // Reconstruct accord node (simplified for now, deep reconstruction would require recursion)
             newNodes.push({
                 id: meta.id,
                 type: 'accord',
                 data: {
                     label: meta.label || 'Accord',
                     items: [], // Populated later if needed, or we rely on groups
                     concentration: 100, // Placeholder
                     color: meta.color,
                     description: meta.description
                 },
                 position: meta.position
             })
          }
      })

      // 2. Find new formula items not in layout
      let newNodesAdded = false
      formulaItems.forEach((item, index) => {
          const exists = newNodes.find(n => n.data.ingredient?.id === item.ingredient.id)
          if (!exists) {
              // Create default node
              const concentration = (item.amount / (activeFormula.targetTotal || 100)) * 100
              newNodes.push({
                  id: uuidv4(),
                  type: 'ingredient',
                  data: {
                      ingredient: item.ingredient,
                      label: item.ingredient.name,
                      concentration,
                      color: 'bg-primary',
                      description: item.ingredient.description
                  },
                  position: { x: 100 + (index * 20), y: 100 + (index * 20) } // Cascade
              })
              newNodesAdded = true
          }
      })

      // 3. Map Connections
      const newConns: Connection[] = layout.connections.map(c => ({
          id: c.id,
          source: c.source,
          target: c.target,
          type: c.type,
          strength: c.strength
      }))

      // 4. Map Groups
      const newGroups: AccordGroup[] = layout.groups || []

      setNodes(newNodes)
      setConnections(newConns)
      setGroups(newGroups)

      // If we added default nodes for new items, save the layout immediately so positions persist
      if (newNodesAdded) {
          // We use a timeout to avoid dispatching during render if this effect runs synchronously?
          // Actually effects run after render.
          // However, we want to avoid infinite loops.
          // newNodesAdded is true only if layout was missing items.
          // Dispatching will trigger this effect again, but next time exists will be true.
          // To be safe, we can defer it or rely on user action.
          // But "instant gratification" means seeing it.
          // Let's defer commit to user action OR strictly check layout mismatch.
          // For now, let's NOT auto-commit, just render. User moves -> commit.
      }

  }, [activeFormula, draggingNodeId]) // Dependency on activeFormula ensures updates when formula changes

  // --- Handlers ---

  const handleSidebarDragStart = (e: React.DragEvent, ingredient: Ingredient) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient))
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const ingredient = JSON.parse(data) as Ingredient
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale

      // 1. Dispatch to Store (Add Ingredient)
      dispatch({ type: "ADD_TO_FORMULA", payload: ingredient })

      // 2. Create Visual Node locally immediately for feedback
      const newNode: VisualNode = {
        id: uuidv4(),
        type: 'ingredient',
        data: {
          ingredient,
          label: ingredient.name,
          concentration: 0, // Starts at 0 in store
          color: 'bg-primary',
          description: ingredient.description
        },
        position: { x: x - 100, y: y - 40 }
      }

      const nextNodes = [...nodes, newNode]
      setNodes(nextNodes)
      setSelectedNodeIds([newNode.id])

      // 3. Commit Layout (Save Position)
      commitLayout(nextNodes, connections, groups)

    } catch (err) {
      console.error("Failed to parse dropped item", err)
    }
  }

  const handleNodeDragStart = (e: React.PointerEvent, id: string) => {
    e.stopPropagation()
    if (!selectedNodeIds.includes(id)) {
        if (!e.shiftKey) {
            setSelectedNodeIds([id])
        } else {
             setSelectedNodeIds(prev => [...prev, id])
        }
        setSelectedGroupId(null)
    }
    setDraggingNodeId(id)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handleNodeSelect = (id: string, shiftKey: boolean) => {
      setSelectedGroupId(null)
      if (shiftKey) {
          setSelectedNodeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
      } else {
          if (!selectedNodeIds.includes(id)) {
              setSelectedNodeIds([id])
          }
      }
  }

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
     setSelectedNodeIds([])
     setSelectedGroupId(null)
     setIsPanning(true)
     canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const deltaX = e.movementX / scale
      const deltaY = e.movementY / scale

      setNodes(prev => prev.map(n => {
        if (selectedNodeIds.includes(n.id)) {
             return {
                ...n,
                position: {
                    x: n.position.x + deltaX,
                    y: n.position.y + deltaY
                }
             }
        }
        return n
      }))
    } else if (isPanning) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    } else if (connectingNodeId) {
       const rect = canvasRef.current?.getBoundingClientRect()
       if (!rect) return
       setTempConnectionEnd({
         x: (e.clientX - rect.left - pan.x) / scale,
         y: (e.clientY - rect.top - pan.y) / scale
       })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    // If we were dragging, commit the new positions
    if (draggingNodeId) {
        commitLayout(nodes, connections, groups)
    }

    if (connectingNodeId) {
       const rect = canvasRef.current?.getBoundingClientRect()
       if (rect) {
           const mouseX = (e.clientX - rect.left - pan.x) / scale
           const mouseY = (e.clientY - rect.top - pan.y) / scale

           const targetNode = nodes.find(n => {
               if (n.id === connectingNodeId) return false
               const dims = NODE_DIMENSIONS[n.type] || NODE_DIMENSIONS.ingredient
               const width = dims.width
               const height = dims.height
               return (
                   mouseX >= n.position.x && mouseX <= n.position.x + width &&
                   mouseY >= n.position.y && mouseY <= n.position.y + height
               )
           })

           if (targetNode) {
                const newConn: Connection = {
                    id: uuidv4(),
                    source: connectingNodeId,
                    target: targetNode.id,
                    type: 'blend',
                    strength: 0.5
                }
                if (!connections.find(c => c.source === connectingNodeId && c.target === targetNode.id)) {
                    const nextConns = [...connections, newConn]
                    setConnections(nextConns)
                    commitLayout(nodes, nextConns, groups)
                }
           }
       }
    }

    setDraggingNodeId(null)
    setIsPanning(false)
    setConnectingNodeId(null)
    setTempConnectionEnd(null)
    canvasRef.current?.releasePointerCapture(e.pointerId)
  }

  const handleConnectStart = (e: React.PointerEvent, nodeId: string) => {
     e.stopPropagation()
     setConnectingNodeId(nodeId)
     const rect = canvasRef.current?.getBoundingClientRect()
     if (rect) {
        setTempConnectionEnd({
             x: (e.clientX - rect.left - pan.x) / scale,
             y: (e.clientY - rect.top - pan.y) / scale
        })
     }
     canvasRef.current?.setPointerCapture(e.pointerId)
  }

  // --- Grouping & Logic ---

  const handleCreateGroup = () => {
      if (selectedNodeIds.length < 2) return
      const newId = uuidv4()
      const newGroup: AccordGroup = {
          id: newId,
          label: 'New Accord Group',
          nodeIds: [...selectedNodeIds],
          color: 'bg-amber-500'
      }
      const nextGroups = [...groups, newGroup]
      setGroups(nextGroups)
      setSelectedNodeIds([])
      setSelectedGroupId(newId)
      commitLayout(nodes, connections, nextGroups)
  }

  const handleCollapseGroup = () => {
     // Simplified implementation for now - just UI logic, skipping full persistence complexity for accord collapsing in this step
     // Ideally collapsing creates a new node in store and hides others.
     // For this plan, I'll keep it local-ish or defer full refactor of collapsing to a later step if needed.
     // But to keep it working:
      if (!selectedGroupId) return
      const group = groups.find(g => g.id === selectedGroupId)
      if (!group) return

      const memberNodes = nodes.filter(n => group.nodeIds.includes(n.id))
      if (memberNodes.length === 0) return

      const avgX = memberNodes.reduce((sum, n) => sum + n.position.x, 0) / memberNodes.length
      const avgY = memberNodes.reduce((sum, n) => sum + n.position.y, 0) / memberNodes.length

      const macroNode: VisualNode = {
          id: uuidv4(),
          type: 'accord',
          data: {
              label: group.label,
              items: memberNodes,
              totalWeight: memberNodes.reduce((sum, n) => sum + (n.data.concentration || 0), 0),
              concentration: 100,
              description: `Collapsed from ${memberNodes.length} nodes.`
          },
          position: { x: avgX, y: avgY }
      }

      // We remove members from visual view but they exist in formula.
      // This is tricky. If we remove them from 'nodes', the sync effect might re-add them as ingredients!
      // To properly support accords, the 'syncVisualNodes' logic needs to know about hidden nodes.
      // For now, let's DISABLE collapsing until we handle "hidden by accord" state,
      // OR we just mark them as hidden in metadata?
      // Let's defer this specific feature fix to ensure the core persistence works first.
      console.warn("Collapsing temporarily disabled during refactor to ensure data integrity.")
  }

  const handleExpandGroup = () => {
      // Similar complexity.
  }

  const handleBridgeNodes = () => {
      // Keep mocked for now, but save to store
      if (selectedNodeIds.length !== 2) return
      const nodeA = nodes.find(n => n.id === selectedNodeIds[0])
      const nodeB = nodes.find(n => n.id === selectedNodeIds[1])
      if (!nodeA || !nodeB) return

      const midX = (nodeA.position.x + nodeB.position.x) / 2
      const midY = (nodeA.position.y + nodeB.position.y) / 2
      const bridgeX = midX
      const bridgeY = midY + 100

      // Bridge is a suggestion, it's not in formula yet unless we add it?
      // The mock created a visual node with ingredient data.
      // If we want it to be real, we must add to formula.
      // For now, let's just make it a visual annotation?
      // Or better, let's actually add the mock ingredient to formula!

      const bridgeIngredient: Ingredient = {
          id: uuidv4(), // New instance
          name: 'Hedione (Bridge)',
          vendor: 'Generic',
          cost: 10,
          note: 'Mid',
          olfactiveFamilies: ['Floral'],
          isAllergen: false,
          ifraLimit: 100,
          concentration: 100,
          longevity: 400,
          impact: 80,
          description: 'AI Suggested Bridge'
      }

      dispatch({ type: "ADD_TO_FORMULA", payload: bridgeIngredient })

      // Visual placement handled by sync or manual add:
      // We manually add visual node to position it correctly
      const bridgeNode: VisualNode = {
          id: uuidv4(),
          type: 'ingredient',
          data: {
              ingredient: bridgeIngredient,
              label: 'Hedione (Bridge)',
              concentration: 0,
              color: 'bg-purple-500',
              description: 'AI Suggestion'
          },
          position: { x: bridgeX, y: bridgeY }
      }

      const nextNodes = [...nodes, bridgeNode]
      const nextConns = [
          ...connections,
          { id: uuidv4(), source: nodeA.id, target: bridgeNode.id, type: 'blend', strength: 0.8 },
          { id: uuidv4(), source: nodeB.id, target: bridgeNode.id, type: 'blend', strength: 0.8 }
      ] as Connection[]

      setNodes(nextNodes)
      setConnections(nextConns)
      commitLayout(nextNodes, nextConns, groups)
      setSelectedNodeIds([bridgeNode.id])
  }


  const handleDelete = (id: string) => {
      // If it's an ingredient node, we should remove from formula
      const node = nodes.find(n => n.id === id)
      if (node && node.type === 'ingredient' && node.data.ingredient) {
          dispatch({ type: "REMOVE_FROM_FORMULA", payload: node.data.ingredient.id })
          // The effect will handle visual removal
      } else {
          // Just a visual node (accord/output)
          const nextNodes = nodes.filter(n => n.id !== id)
          const nextConns = connections.filter(c => c.source !== id && c.target !== id)
          setNodes(nextNodes)
          setConnections(nextConns)
          commitLayout(nextNodes, nextConns, groups)
      }
      setSelectedNodeIds(prev => prev.filter(nid => nid !== id))
  }

  const handleConnectionUpdate = (id: string, updates: Partial<Connection>) => { const nextConns = connections.map(c => c.id === id ? { ...c, ...updates } : c); setConnections(nextConns); commitLayout(nodes, nextConns, groups) }

  const handleNodeUpdate = (id: string, updates: Partial<VisualNode['data']>) => {
      // Mostly used for visual updates. If modifying concentration, we should use dispatch.
      // But for color/label:
      const nextNodes = nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n)
      setNodes(nextNodes)
      commitLayout(nextNodes, connections, groups)
  }

  // --- Inspector Data ---
  const getInspectorData = () => {
      if (selectedGroupId) {
          // Group logic
           const group = groups.find(g => g.id === selectedGroupId)
           if (!group) return null
           return {
               type: 'single' as const,
               node: {
                   id: group.id,
                   type: 'accord' as const,
                   data: { label: group.label, items: nodes.filter(n => group.nodeIds.includes(n.id)), concentration: 100, description: "Group" },
                   position: {x:0, y:0}
               }
           }
      }
      if (selectedNodeIds.length === 1) {
          const node = nodes.find(n => n.id === selectedNodeIds[0])
          return node ? { type: 'single' as const, node } : null
      }
      if (selectedNodeIds.length > 1) {
          return { type: 'multi' as const, nodes: nodes.filter(n => selectedNodeIds.includes(n.id)) }
      }
      return null
  }

  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden text-slate-200 font-sans select-none">
      <SidebarComponent onDragStart={handleSidebarDragStart} />

      <div className="flex-1 relative flex flex-col min-w-0">
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <div className="bg-zinc-900 border border-slate-700 rounded-lg shadow-lg flex flex-col p-1">
                <button
                  className={cn("p-2 rounded transition-colors", !isPanning ? "text-primary bg-primary/10" : "text-slate-400 hover:text-white")}
                  onClick={() => setIsPanning(false)}
                >
                    <MousePointer2 className="w-5 h-5" />
                </button>
                <button
                  className={cn("p-2 rounded transition-colors", isPanning ? "text-primary bg-primary/10" : "text-slate-400 hover:text-white")}
                  onClick={() => setIsPanning(true)}
                >
                    <Move className="w-5 h-5" />
                </button>
                <div className="h-px bg-slate-800 my-1"></div>

                {selectedNodeIds.length > 1 && (
                    <button
                        className="p-2 rounded transition-colors text-amber-500 hover:bg-amber-500/10"
                        onClick={handleCreateGroup}
                    >
                        <BoxSelect className="w-5 h-5" />
                    </button>
                )}
                {selectedNodeIds.length === 2 && (
                    <button
                        className="p-2 rounded transition-colors text-purple-400 hover:bg-purple-500/10 animate-pulse"
                        onClick={handleBridgeNodes}
                    >
                        <WandSparkles className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        <div
            ref={canvasRef}
            className={cn("flex-1 relative overflow-hidden bg-zinc-950", isPanning ? "cursor-grab active:cursor-grabbing" : "cursor-default")}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
             <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transformOrigin: '0 0'
                }}
             />

             <div
                className="absolute inset-0 pointer-events-none origin-top-left"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
                }}
             >
                 <div className="pointer-events-auto">
                    {groups.map(group => (
                        <AccordGroupComponent
                            key={group.id}
                            group={group}
                            nodes={nodes}
                            selected={selectedGroupId === group.id}
                            onSelect={() => {
                                setSelectedGroupId(group.id)
                                setSelectedNodeIds([])
                            }}
                        />
                    ))}
                 </div>

                 <svg className="absolute inset-0 w-[5000px] h-[5000px] pointer-events-none overflow-visible">
                     <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {connections.map(conn => {
                        const sourceNode = nodes.find(n => n.id === conn.source)
                        const targetNode = nodes.find(n => n.id === conn.target)
                        if (!sourceNode || !targetNode) return null

                        const sourcePos = getNodeCenter(sourceNode).output
                        const targetPos = getNodeCenter(targetNode).input

                        return (
                            <ConnectionComponent
                                key={conn.id}
                                x1={sourcePos.x} y1={sourcePos.y}
                                x2={targetPos.x} y2={targetPos.y}
                                type={conn.type} strength={conn.strength}
                            />
                        )
                    })}
                    {connectingNodeId && tempConnectionEnd && (
                        (() => {
                            const sourceNode = nodes.find(n => n.id === connectingNodeId)
                            if (!sourceNode) return null
                            const sourcePos = getNodeCenter(sourceNode).output
                            return (
                                <ConnectionComponent
                                    x1={sourcePos.x} y1={sourcePos.y}
                                    x2={tempConnectionEnd.x} y2={tempConnectionEnd.y}
                                    active
                                />
                            )
                        })()
                    )}
                 </svg>

                 <div className="pointer-events-auto">
                    {nodes.map(node => (
                        <NodeComponent
                            key={node.id}
                            node={node}
                            selected={selectedNodeIds.includes(node.id)}
                            onSelect={handleNodeSelect}
                            onDragStart={handleNodeDragStart}
                            onConnectStart={handleConnectStart}
                            onUpdate={handleNodeUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                 </div>
             </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 flex items-center bg-zinc-900 border border-slate-700 rounded-full shadow-lg px-2 py-1 gap-2">
            <button className="p-1 text-slate-400 hover:text-white rounded-full" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 w-8 text-center">{Math.round(scale * 100)}%</span>
            <button className="p-1 text-slate-400 hover:text-white rounded-full" onClick={() => setScale(s => Math.min(2, s + 0.1))}>
                <Plus className="w-4 h-4" />
            </button>
        </div>

      </div>

      <InspectorComponent selectionData={getInspectorData()} allNodes={nodes} allConnections={connections} onUpdateConnection={handleConnectionUpdate} />
    </div>
  )
}
