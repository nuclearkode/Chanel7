import React from 'react'
import { VisualNode } from './types'
import { Layers, CheckCircle, Beaker, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NODE_DIMENSIONS } from './constants'

interface NodeProps {
  node: VisualNode
  selected?: boolean
  onSelect: (id: string, shiftKey: boolean) => void
  onDragStart: (e: React.PointerEvent, id: string) => void
  onConnectStart: (e: React.PointerEvent, nodeId: string) => void
  onUpdate?: (id: string, updates: Partial<VisualNode['data']>) => void
  onDelete?: (id: string) => void
}

export function NodeComponent({ node, selected, onSelect, onDragStart, onConnectStart, onUpdate, onDelete }: NodeProps) {
  const { type, data } = node

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    onSelect(node.id, e.shiftKey)
    onDragStart(e, node.id)
  }

  const handleConnectStart = (e: React.PointerEvent) => {
    e.stopPropagation()
    onConnectStart(e, node.id)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onUpdate) {
          onUpdate(node.id, { concentration: parseFloat(e.target.value) })
      }
  }

  // --- Styles ---
  const baseClasses = "absolute transition-all duration-200 cursor-grab active:cursor-grabbing select-none"
  const selectedClasses = selected ? "ring-1 ring-primary shadow-lg shadow-primary/20" : "shadow-lg"
  const glassPanel = "bg-zinc-900/90 backdrop-blur-sm border border-cyan-500/20"

  // --- Output Node ---
  if (type === 'output') {
    return (
      <div
        className={cn(
          baseClasses,
          "bg-zinc-950 border border-slate-700 border-l-4 border-l-green-500 rounded-xl z-10",
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
           title="Input"
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
          glassPanel,
          "rounded-xl z-20 border-amber-500/50",
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
        <div className="flex items-center justify-between p-3 border-b border-amber-500/20 bg-amber-500/10 rounded-t-lg">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-amber-500 rounded shadow-lg shadow-amber-500/20">
              <Layers className="text-zinc-950 w-3 h-3" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm leading-none">{data.label}</h3>
              <span className="text-[10px] text-amber-500 uppercase tracking-wider font-semibold">Macro Node</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950/50 p-2 rounded border border-slate-700/50">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Materials</span>
              <span className="text-base font-mono text-white">{data.items ? data.items.length : 0}</span>
            </div>
            <div className="bg-zinc-950/50 p-2 rounded border border-slate-700/50">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Total Wt</span>
              <span className="text-base font-mono text-white">{data.totalWeight || 0}g</span>
            </div>
          </div>
        </div>

        {/* Footer / Ports */}
        <div className="bg-zinc-950/30 p-1.5 rounded-b-lg border-t border-slate-700/50 flex justify-center">
            <span className="text-[9px] text-slate-600 font-mono tracking-widest">ID: {node.id.slice(0, 8)}</span>
        </div>

        {/* Input Port */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-zinc-900 shadow-sm" title="Input" />

        {/* Output Port */}
        <div
            className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-zinc-900 shadow-sm hover:scale-125 transition-transform cursor-crosshair"
            onPointerDown={handleConnectStart}
            title="Output"
        />
      </div>
    )
  }

  // --- Ingredient Node (Default) ---
  const iconColorClass = data.color?.replace('bg-', 'text-') || 'text-slate-400';

  return (
    <div
      className={cn(
        baseClasses,
        glassPanel,
        "rounded-lg z-10 hover:shadow-cyan-500/20 transition-all",
        selectedClasses
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: NODE_DIMENSIONS.ingredient.width
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="h-8 bg-zinc-950/50 border-b border-cyan-500/20 rounded-t-lg flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
           {/* Icon based on color/type */}
          <Beaker className={cn("w-3 h-3", iconColorClass)} />
          <span className="text-xs font-bold tracking-wide uppercase text-slate-300 truncate max-w-[140px]" title={data.label}>{data.label}</span>
        </div>
        <button
            className="text-slate-600 hover:text-red-400 transition-colors"
            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(node.id) }}
        >
            <X className="w-3 h-3" />
        </button>
      </div>

      <div className="p-3 relative">
        <div className="space-y-3">
            <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Part / Dilution</span>
                    <span className="text-cyan-400 font-mono">{data.concentration?.toFixed(1) || "10.0"}%</span>
                </div>

                {/* Interactive Slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.5"
                    value={data.concentration || 10}
                    onChange={handleSliderChange}
                    onPointerDown={(e) => e.stopPropagation()} // Allow slider interaction without dragging node
                    className="w-full h-1 bg-zinc-950 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 hover:[&::-webkit-slider-thumb]:bg-cyan-400 transition-all"
                />
            </div>

            {/* Molecule Info / Extra line */}
             <div className="text-[9px] text-slate-500 font-mono leading-tight truncate">
                {data.ingredient?.casNumber ? `CAS: ${data.ingredient.casNumber}` : "CAS: N/A"}
            </div>
        </div>

        {/* Input Port (Optional, if we want chaining) */}
        <div
            className="absolute left-[-7px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-slate-600 bg-zinc-900 hover:border-cyan-500 transition-colors cursor-crosshair"
            title="Input: Modulation"
        />

        {/* Output Port */}
        <div
            className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-500 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(34,211,238,0.5)] hover:scale-125 transition-transform cursor-crosshair"
            onPointerDown={handleConnectStart}
            title="Output"
        />
      </div>
    </div>
  )
}
