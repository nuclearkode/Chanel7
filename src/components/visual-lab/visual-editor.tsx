"use client"

import React, { useState, useRef, useEffect } from 'react'
import { SidebarComponent } from './sidebar'
import { InspectorComponent } from './inspector'
import { NodeComponent } from './node'
import { ConnectionComponent } from './connection'
import { AccordGroupComponent } from './group'
import { VisualNode, Connection, NodeType, AccordGroup } from './types'
import { Ingredient } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'
import { Plus, Minus, MousePointer2, Move, LayoutGrid, Layers, Archive, BoxSelect, Maximize, WandSparkles } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NODE_DIMENSIONS } from './constants'

export function VisualEditor() {
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

  // --- Handlers ---

  // Sidebar Drag & Drop
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

      // Calculate position relative to canvas content (accounting for pan/zoom)
      const x = (e.clientX - rect.left - pan.x) / scale
      const y = (e.clientY - rect.top - pan.y) / scale

      const newNode: VisualNode = {
        id: uuidv4(),
        type: 'ingredient',
        data: {
          ingredient,
          label: ingredient.name,
          concentration: 10, // Default 10%
          color: 'bg-primary',
          description: ingredient.description
        },
        position: { x: x - 100, y: y - 40 } // Center the node roughly
      }

      setNodes(prev => [...prev, newNode])
      setSelectedNodeIds([newNode.id])
      setSelectedGroupId(null)
    } catch (err) {
      console.error("Failed to parse dropped item", err)
    }
  }

  // Node Dragging
  const handleNodeDragStart = (e: React.PointerEvent, id: string) => {
    e.stopPropagation()
    // Select the node if not already selected (multi-select behavior preservation)
    if (!selectedNodeIds.includes(id)) {
        if (!e.shiftKey) {
            setSelectedNodeIds([id])
        } else {
             setSelectedNodeIds(prev => [...prev, id])
        }
        setSelectedGroupId(null)
    }

    setDraggingNodeId(id)
    // Capture pointer to canvas to ensure we get move events even if mouse leaves node
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  // Node Selection Click
  const handleNodeSelect = (id: string, shiftKey: boolean) => {
      setSelectedGroupId(null)
      if (shiftKey) {
          setSelectedNodeIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
      } else {
          // If already selected and no shift, do nothing (dragging handled elsewhere)
          if (!selectedNodeIds.includes(id)) {
              setSelectedNodeIds([id])
          }
      }
  }

  // Canvas Panning
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
     // Only pan if clicking on empty canvas (not stopped by node)
     // Deselect if clicking empty space
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
        // Move all selected nodes if dragging one of them
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
       // Update temp line
       const rect = canvasRef.current?.getBoundingClientRect()
       if (!rect) return
       setTempConnectionEnd({
         x: (e.clientX - rect.left - pan.x) / scale,
         y: (e.clientY - rect.top - pan.y) / scale
       })
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (connectingNodeId) {
       const rect = canvasRef.current?.getBoundingClientRect()
       if (rect) {
           const mouseX = (e.clientX - rect.left - pan.x) / scale
           const mouseY = (e.clientY - rect.top - pan.y) / scale

           // Hit Test for Connection Target
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
                    target: targetNode.id
                }
                // Avoid duplicates
                if (!connections.find(c => c.source === connectingNodeId && c.target === targetNode.id)) {
                    setConnections(prev => [...prev, newConn])
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

  // Connection Logic
  const handleConnectStart = (e: React.PointerEvent, nodeId: string) => {
     e.stopPropagation() // Prevent panning/dragging node
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

  // --- New Logic ---

  const handleCreateGroup = () => {
      if (selectedNodeIds.length < 2) return
      const newId = uuidv4()
      const newGroup: AccordGroup = {
          id: newId,
          label: 'New Accord Group',
          nodeIds: [...selectedNodeIds],
          color: 'bg-amber-500'
      }
      setGroups(prev => [...prev, newGroup])
      setSelectedNodeIds([])
      setSelectedGroupId(newId)
  }

  const handleCollapseGroup = () => {
      if (!selectedGroupId) return
      const group = groups.find(g => g.id === selectedGroupId)
      if (!group) return

      const memberNodes = nodes.filter(n => group.nodeIds.includes(n.id))
      if (memberNodes.length === 0) return

      // Calculate Centroid
      const avgX = memberNodes.reduce((sum, n) => sum + n.position.x, 0) / memberNodes.length
      const avgY = memberNodes.reduce((sum, n) => sum + n.position.y, 0) / memberNodes.length

      // Create Macro Node
      const macroNode: VisualNode = {
          id: uuidv4(),
          type: 'accord',
          data: {
              label: group.label,
              items: memberNodes, // Keep original nodes as data
              totalWeight: memberNodes.reduce((sum, n) => sum + (n.data.concentration || 0), 0), // Mock weight calc
              concentration: 100,
              description: `Collapsed from ${memberNodes.length} nodes.`
          },
          position: { x: avgX, y: avgY }
      }

      // Update State
      // Remove members, add macro node
      setNodes(prev => prev.filter(n => !group.nodeIds.includes(n.id)).concat(macroNode))
      // Remove group
      setGroups(prev => prev.filter(g => g.id !== selectedGroupId))

      // Select new node
      setSelectedGroupId(null)
      setSelectedNodeIds([macroNode.id])
  }

  const handleExpandGroup = () => {
      if (selectedNodeIds.length !== 1) return
      const macroNode = nodes.find(n => n.id === selectedNodeIds[0] && n.type === 'accord')
      if (!macroNode || !macroNode.data.items || macroNode.data.items.length === 0) return

      // Calculate original centroid
      const originalCentroid = {
          x: macroNode.data.items.reduce((sum, n) => sum + n.position.x, 0) / macroNode.data.items.length,
          y: macroNode.data.items.reduce((sum, n) => sum + n.position.y, 0) / macroNode.data.items.length
      }

      // Calculate delta
      const dx = macroNode.position.x - originalCentroid.x
      const dy = macroNode.position.y - originalCentroid.y

      // Restore nodes with offset
      const restoredNodes = macroNode.data.items.map(n => ({
          ...n,
          position: {
              x: n.position.x + dx,
              y: n.position.y + dy
          }
      }))

      // Create Group
      const newGroup: AccordGroup = {
          id: uuidv4(),
          label: macroNode.data.label,
          nodeIds: restoredNodes.map(n => n.id),
          color: 'bg-amber-500'
      }

      setNodes(prev => prev.filter(n => n.id !== macroNode.id).concat(restoredNodes))
      setGroups(prev => [...prev, newGroup])
      setSelectedNodeIds([])
      setSelectedGroupId(newGroup.id)
  }

  const handleBridgeNodes = () => {
      if (selectedNodeIds.length !== 2) return

      const nodeA = nodes.find(n => n.id === selectedNodeIds[0])
      const nodeB = nodes.find(n => n.id === selectedNodeIds[1])

      if (!nodeA || !nodeB) return

      // Mock AI Logic: Find a midpoint bridge
      const midX = (nodeA.position.x + nodeB.position.x) / 2
      const midY = (nodeA.position.y + nodeB.position.y) / 2

      const bridgeX = midX
      const bridgeY = midY + 100

      const bridgeNode: VisualNode = {
          id: uuidv4(),
          type: 'ingredient',
          data: {
              label: 'AI Bridge',
              concentration: 5,
              color: 'bg-purple-500',
              description: 'AI Suggestion: Hedione (Bridge). Connects floral and green notes efficiently.',
              ingredient: {
                  id: 'hedione-mock',
                  name: 'Hedione',
                  casNumber: '24851-98-7',
                  description: 'Transparent floral jasmine note with citrus freshness.',
                  family: 'Floral',
                  subFamily: 'Jasmine',
                  note: 'Mid',
                  tenacity: 400,
                  impact: 80,
                  molecularWeight: 226.31,
                  vaporPressure: 0.001,
                  logP: 2.5,
                  appearance: 'Colorless Liquid',
                  odorType: 'Floral',
                  odorStrength: 'Medium',
                  isNatural: false,
                  cost: 10,
                  supplier: 'Generic'
              }
          },
          position: { x: bridgeX, y: bridgeY }
      }

      setNodes(prev => [...prev, bridgeNode])

      setConnections(prev => [
          ...prev,
          { id: uuidv4(), source: nodeA.id, target: bridgeNode.id },
          { id: uuidv4(), source: nodeB.id, target: bridgeNode.id }
      ])

      setSelectedNodeIds([bridgeNode.id])
  }


  const handleDelete = (id: string) => {
      setNodes(prev => prev.filter(n => n.id !== id))
      setConnections(prev => prev.filter(c => c.source !== id && c.target !== id))
      setGroups(prev => prev.map(g => ({
          ...g,
          nodeIds: g.nodeIds.filter(nid => nid !== id)
      })).filter(g => g.nodeIds.length > 0))

      if (selectedNodeIds.includes(id)) {
          setSelectedNodeIds(prev => prev.filter(nid => nid !== id))
      }
  }

  const handleNodeUpdate = (id: string, updates: Partial<VisualNode['data']>) => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...updates } } : n))
  }

  // --- Render Helpers ---
  const getNodeCenter = (node: VisualNode) => {
      const dims = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.ingredient
      const width = dims.width
      const height = dims.height

      return {
          input: { x: node.position.x, y: node.position.y + height / 2 },
          output: { x: node.position.x + width, y: node.position.y + height / 2 }
      }
  }

  const getInspectorNode = (): VisualNode | null => {
      if (selectedGroupId) {
          const group = groups.find(g => g.id === selectedGroupId)
          if (!group) return null
          const members = nodes.filter(n => group.nodeIds.includes(n.id))
          return {
              id: group.id,
              type: 'accord',
              data: {
                  label: group.label,
                  items: members,
                  concentration: 100,
                  description: "Active Group (Micro-View). Can be collapsed to Macro Node."
              },
              position: { x: 0, y: 0 }
          }
      }
      if (selectedNodeIds.length === 1) {
          return nodes.find(n => n.id === selectedNodeIds[0]) || null
      }
      return null
  }

  const getInspectorData = () => {
      const singleNode = getInspectorNode();
      if (singleNode) return { type: 'single', node: singleNode };

      if (selectedNodeIds.length > 1) {
          const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
          return {
              type: 'multi',
              nodes: selectedNodes
          }
      }
      return null;
  }

  return (
    <div className="flex h-full w-full bg-zinc-950 overflow-hidden text-slate-200 font-sans select-none">
      {/* Sidebar */}
      <SidebarComponent onDragStart={handleSidebarDragStart} />

      {/* Main Area */}
      <div className="flex-1 relative flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            <div className="bg-zinc-900 border border-slate-700 rounded-lg shadow-lg flex flex-col p-1">
                <button
                  className={cn("p-2 rounded transition-colors", !isPanning ? "text-primary bg-primary/10" : "text-slate-400 hover:text-white")}
                  title="Select Tool"
                  onClick={() => setIsPanning(false)}
                >
                    <MousePointer2 className="w-5 h-5" />
                </button>
                <button
                  className={cn("p-2 rounded transition-colors", isPanning ? "text-primary bg-primary/10" : "text-slate-400 hover:text-white")}
                  title="Move Canvas"
                  onClick={() => setIsPanning(true)}
                >
                    <Move className="w-5 h-5" />
                </button>
                <div className="h-px bg-slate-800 my-1"></div>

                {selectedNodeIds.length > 1 && (
                    <button
                        className="p-2 rounded transition-colors text-amber-500 hover:bg-amber-500/10"
                        title="Group Selection"
                        onClick={handleCreateGroup}
                    >
                        <BoxSelect className="w-5 h-5" />
                    </button>
                )}
                {selectedNodeIds.length === 2 && (
                    <button
                        className="p-2 rounded transition-colors text-purple-400 hover:bg-purple-500/10 animate-pulse"
                        title="AI Bridge: Suggest Connector"
                        onClick={handleBridgeNodes}
                    >
                        <WandSparkles className="w-5 h-5" />
                    </button>
                )}
                {selectedGroupId && (
                    <button
                        className="p-2 rounded transition-colors text-cyan-500 hover:bg-cyan-500/10"
                        title="Collapse to Macro Node"
                        onClick={handleCollapseGroup}
                    >
                        <Archive className="w-5 h-5" />
                    </button>
                )}
                {selectedNodeIds.length === 1 && nodes.find(n => n.id === selectedNodeIds[0])?.type === 'accord' && (
                    <button
                        className="p-2 rounded transition-colors text-amber-500 hover:bg-amber-500/10"
                        title="Expand to Group"
                        onClick={handleExpandGroup}
                    >
                        <Maximize className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        {/* Canvas */}
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
             {/* Grid Background */}
             <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                    backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transformOrigin: '0 0'
                }}
             />

             {/* Content Container (Panned/Scaled) */}
             <div
                className="absolute inset-0 pointer-events-none origin-top-left"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
                }}
             >
                 {/* Groups Layer */}
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

                 {/* Connections Layer */}
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
                            />
                        )
                    })}
                    {/* Temp Connection Line */}
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

                 {/* Nodes Layer */}
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

        {/* Zoom Controls */}
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

      {/* Inspector */}
      <InspectorComponent selectionData={getInspectorData()} allNodes={nodes} />
    </div>
  )
}
