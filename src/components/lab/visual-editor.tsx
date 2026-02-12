"use client"

import React, { useState, useRef, useEffect } from "react"
import { type Ingredient } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VisualEditorProps {
  ingredients: Ingredient[] // Available ingredients to add
}

interface Node {
  id: string
  x: number
  y: number
  ingredient: Ingredient
}

interface Edge {
  id: string
  from: string
  to: string
}

export function VisualEditor({ ingredients }: VisualEditorProps) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Add a node
  const addNode = (ingredient: Ingredient) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNodes(prev => [...prev, {
      id,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      ingredient
    }])
  }

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (e.button === 0) { // Left click
        setDraggingNode(nodeId)
        setSelectedNode(nodeId)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - 60 // Center offset
      const y = e.clientY - rect.top - 20

      setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n))
    }
  }

  const handleMouseUp = () => {
    setDraggingNode(null)
  }

  // Connect Nodes
  const handleRightClick = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    if (selectedNode && selectedNode !== nodeId) {
        // Create edge
        const edgeId = `${selectedNode}-${nodeId}`
        if (!edges.find(e => e.id === edgeId)) {
            setEdges(prev => [...prev, { id: edgeId, from: selectedNode, to: nodeId }])
        }
    }
    setSelectedNode(nodeId)
  }

  const deleteNode = (id: string) => {
      setNodes(prev => prev.filter(n => n.id !== id))
      setEdges(prev => prev.filter(e => e.from !== id && e.to !== id))
      if (selectedNode === id) setSelectedNode(null)
  }

  return (
    <div className="flex h-full border rounded-lg overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/20 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4 text-sm">Available Ingredients</h3>
        <div className="space-y-2">
          {ingredients.slice(0, 50).map(ing => (
            <div
                key={ing.id}
                className="p-2 bg-card border rounded text-xs cursor-pointer hover:bg-accent flex justify-between items-center"
                onClick={() => addNode(ing)}
            >
                <span className="truncate flex-1">{ing.name}</span>
                <ArrowRight className="w-3 h-3 opacity-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/50"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 p-2 rounded border">
            Left Drag to Move • Right Click to Connect from Selected
        </div>

        {/* Edges */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
            {edges.map(edge => {
                const n1 = nodes.find(n => n.id === edge.from)
                const n2 = nodes.find(n => n.id === edge.to)
                if (!n1 || !n2) return null
                return (
                    <line
                        key={edge.id}
                        x1={n1.x + 60} y1={n1.y + 20}
                        x2={n2.x + 60} y2={n2.y + 20}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        markerEnd="url(#arrowhead)"
                    />
                )
            })}
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
                </marker>
            </defs>
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
            <div
                key={node.id}
                className={`absolute w-32 p-2 rounded border shadow-sm cursor-move select-none transition-shadow ${
                    selectedNode === node.id ? 'ring-2 ring-primary border-primary bg-background' : 'bg-card border-border'
                }`}
                style={{ left: node.x, top: node.y }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onContextMenu={(e) => handleRightClick(e, node.id)}
            >
                <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-[10px] leading-tight truncate" title={node.ingredient.name}>{node.ingredient.name}</div>
                    <button onClick={(e) => { e.stopPropagation(); deleteNode(node.id) }} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-[8px] h-4 px-1">{node.ingredient.note}</Badge>
                    <Badge variant="outline" className="text-[8px] h-4 px-1">{node.ingredient.impact}</Badge>
                </div>
                {/* Connectors Visuals */}
                <div className="absolute -left-1 top-1/2 w-2 h-2 bg-muted-foreground rounded-full -translate-y-1/2" />
                <div className="absolute -right-1 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2" />
            </div>
        ))}
      </div>
    </div>
  )
}
