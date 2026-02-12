import React from 'react'
import { VisualNode } from './types'
import { Layers, CheckCircle, GripVertical, Beaker, Box, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NODE_DIMENSIONS } from './constants'

interface NodeProps {
  node: VisualNode
  selected?: boolean
  onSelect: (id: string) => void
  onDragStart: (e: React.PointerEvent, id: string) => void
  onConnectStart: (e: React.PointerEvent, nodeId: string) => void
}

export function NodeComponent({ node, selected, onSelect, onDragStart, onConnectStart }: NodeProps) {
  const { type, data } = node

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    onSelect(node.id)
    onDragStart(e, node.id)
  }

  const handleConnectStart = (e: React.PointerEvent) => {
    e.stopPropagation()
    onConnectStart(e, node.id)
  }

  // --- Styles ---
  const baseClasses = "absolute transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
  const selectedClasses = selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""

  // --- Output Node ---
  if (type === 'output') {
    return (
      <div
        className={cn(
          baseClasses,
          "bg-zinc-900 border border-slate-700 border-l-4 border-l-green-500 rounded-xl shadow-lg z-10",
          selectedClasses
        )}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: NODE_DIMENSIONS.output.width
        }}
        onPointerDown={handlePointerDown}
      >
        <div className="p-3 flex items-center gap-3">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <div>
            <h4 className="text-sm font-medium text-slate-200">Accord Output</h4>
            <span className="text-xs text-slate-500">Target Reached</span>
          </div>
        </div>
        {/* Input Port */}
        <div
          className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-zinc-900 hover:bg-primary cursor-crosshair transition-colors"
          onPointerDown={(e) => { e.stopPropagation(); /* Output usually doesn't connect outwards? Or acts as input? This is input port. */ }}
        />
      </div>
    )
  }

  // --- Accord Node (Macro) ---
  if (type === 'accord') {
    return (
      <div
        className={cn(
          baseClasses,
          "bg-zinc-900/95 backdrop-blur-sm border-2 border-primary rounded-xl shadow-[0_0_30px_rgba(17,164,212,0.15)] z-20",
          selectedClasses
        )}
        style={{
          left: node.position.x,
          top: node.position.y,
          width: NODE_DIMENSIONS.accord.width
        }}
        onPointerDown={handlePointerDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-primary/10 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary rounded-md shadow-lg shadow-primary/20">
              <Layers className="text-white w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-none">{data.label}</h3>
              <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">Macro Node</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-950 p-2 rounded border border-slate-700">
              <span className="block text-[10px] text-slate-500 uppercase">Materials</span>
              <span className="text-lg font-mono text-white">{data.items ? data.items.length : 0}</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded border border-slate-700">
              <span className="block text-[10px] text-slate-500 uppercase">Total Wt</span>
              <span className="text-lg font-mono text-white">{data.totalWeight || 0}g</span>
            </div>
          </div>
        </div>

        {/* Footer / Ports */}
        <div className="bg-zinc-950/50 p-2 rounded-b-lg border-t border-slate-700 flex justify-center">
            <span className="text-[10px] text-slate-500 font-mono">ID: {node.id.slice(0, 8)}</span>
        </div>

        {/* Input Port */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-zinc-900 shadow-sm" />

        {/* Output Port */}
        <div
            className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-zinc-900 shadow-sm hover:scale-125 transition-transform cursor-crosshair"
            onPointerDown={handleConnectStart}
        />
      </div>
    )
  }

  // --- Ingredient Node (Default) ---
  return (
    <div
      className={cn(
        baseClasses,
        "bg-zinc-900 border border-slate-600 rounded-xl shadow-lg hover:border-primary/50 transition-colors group z-10",
        selectedClasses
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_DIMENSIONS.ingredient.width
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-zinc-950 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", data.color || "bg-slate-400")}></span>
          <span className="font-medium text-slate-200 truncate max-w-[120px]" title={data.label}>{data.label}</span>
        </div>
        <span className="text-xs text-slate-500 font-mono">MAT-{node.id.slice(-2)}</span>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-slate-400">Concentration</span>
          <span className="text-sm font-mono text-primary">{data.concentration?.toFixed(1) || "0.0"}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn("h-full", data.color || "bg-slate-400")}
            style={{ width: `${Math.min(data.concentration || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Output Port */}
      <div
        className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-zinc-900 hover:bg-primary cursor-crosshair transition-colors"
        onPointerDown={handleConnectStart}
      />
    </div>
  )
}
