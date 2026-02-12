"use client"

import React, { useState, useRef, useEffect } from 'react'
import { SidebarComponent } from './sidebar'
import { InspectorComponent } from './inspector'
import { NodeComponent } from './node'
import { ConnectionComponent } from './connection'
import { VisualNode, Connection, NodeType } from './types'
import { Ingredient } from "@/lib/types"
import { v4 as uuidv4 } from 'uuid'
import { Plus, Minus, MousePointer2, Move, LayoutGrid } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NODE_DIMENSIONS } from './constants'

export function VisualEditor() {
  const [nodes, setNodes] = useState<VisualNode[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

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
      setSelectedNodeId(newNode.id)
    } catch (err) {
      console.error("Failed to parse dropped item", err)
    }
  }

  // Node Dragging
  const handleNodeDragStart = (e: React.PointerEvent, id: string) => {
    e.stopPropagation()
    // Select the node
    setSelectedNodeId(id)

    setDraggingNodeId(id)
    // Capture pointer to canvas to ensure we get move events even if mouse leaves node
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  // Canvas Panning
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
     // Only pan if clicking on empty canvas (not stopped by node)
     // Deselect if clicking empty space
     setSelectedNodeId(null)

     setIsPanning(true)
     canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      setNodes(prev => prev.map(n => {
        if (n.id === draggingNodeId) {
          return {
            ...n,
            position: {
              x: n.position.x + e.movementX / scale,
              y: n.position.y + e.movementY / scale
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
                            selected={selectedNodeId === node.id}
                            onSelect={setSelectedNodeId}
                            onDragStart={handleNodeDragStart}
                            onConnectStart={handleConnectStart}
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
      <InspectorComponent selectedNode={nodes.find(n => n.id === selectedNodeId) || null} />
    </div>
  )
}
