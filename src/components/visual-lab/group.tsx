import React from 'react'
import { VisualNode, AccordGroup } from './types'
import { Layers, AlertTriangle } from 'lucide-react'
import { NODE_DIMENSIONS } from './constants'

interface GroupProps {
  group: AccordGroup
  nodes: VisualNode[]
  selected?: boolean
  onSelect?: (id: string) => void
}

export function AccordGroupComponent({ group, nodes, selected, onSelect }: GroupProps) {
  // 1. Find member nodes
  const members = nodes.filter(n => group.nodeIds.includes(n.id))
  if (members.length === 0) return null

  // 2. Calculate Bounding Box
  // We need to account for node dimensions
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

  members.forEach(node => {
    const dim = NODE_DIMENSIONS[node.type] || NODE_DIMENSIONS.ingredient
    minX = Math.min(minX, node.position.x)
    minY = Math.min(minY, node.position.y)
    maxX = Math.max(maxX, node.position.x + dim.width)
    maxY = Math.max(maxY, node.position.y + dim.height)
  })

  // Add padding
  const padding = 40
  const left = minX - padding
  const top = minY - padding - 20 // Extra for header
  const width = maxX - minX + padding * 2
  const height = maxY - minY + padding * 2 + 20

  // 3. Calculate Telemetry
  // Total concentration sum (Parts)
  const totalParts = members.reduce((sum, n) => sum + (n.data.concentration || 0), 0) || 1

  // IFRA Check
  // Logic: For each ingredient, calc (concentration / totalParts) * 100 -> % in accord
  // Then compare to ifraLimit.
  let ifraPass = true
  let ifraDetails = ""

  members.forEach(n => {
      if (n.type === 'ingredient' && n.data.ingredient?.ifraLimit) {
          const percentInAccord = ((n.data.concentration || 0) / totalParts) * 100
          if (percentInAccord > n.data.ingredient.ifraLimit) {
              ifraPass = false
              ifraDetails = `${n.data.label} exceeds limit`
          }
      }
  })

  // Profile
  // Weighted average of profiles
  const profileSum: Record<string, number> = {}
  members.forEach(n => {
      const prof = n.data.ingredient?.olfactoryProfile || { "Unknown": 100 }
      const weight = (n.data.concentration || 0)
      Object.entries(prof).forEach(([fam, val]) => {
          profileSum[fam] = (profileSum[fam] || 0) + (val * weight)
      })
  })

  // Normalize
  const profile: Record<string, number> = {}

  Object.entries(profileSum).forEach(([fam, val]) => {
      const normalized = val / totalParts
      profile[fam] = normalized
  })

  // Format profile string: "Citrus (80%), Green (20%)" - top 2
  const sortedProfile = Object.entries(profile).sort((a, b) => b[1] - a[1]).slice(0, 2)
  const profileStr = sortedProfile.map(([f, v]) => `${f} (${Math.round(v)}%)`).join(', ')


  return (
    <div
      className={`absolute border-2 border-dashed ${selected ? 'border-amber-500 bg-amber-500/10' : 'border-amber-500/30 bg-amber-500/5'} rounded-3xl z-0 backdrop-blur-[2px] transition-all duration-300 pointer-events-none`}
      style={{
        left,
        top,
        width,
        height
      }}
    >
        {/* Header Label */}
        <div
            className={`absolute -top-4 left-6 bg-zinc-950 border ${selected ? 'border-amber-500 text-amber-400' : 'border-amber-500/50 text-amber-600'} px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl z-10 pointer-events-auto cursor-pointer hover:bg-zinc-900 transition-colors`}
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(group.id); }}
        >
            <Layers className="w-3 h-3" />
            {group.label}
        </div>

        {/* Telemetry Bar */}
        <div
            className="absolute bottom-0 left-0 right-0 bg-zinc-950/90 border-t border-amber-500/20 p-2.5 rounded-b-3xl flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-auto cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(group.id); }}
        >
            <div className="flex items-center gap-3">
                <span className="text-amber-500/80 uppercase tracking-wide">IFRA:</span>
                {ifraPass ? (
                    <span className="text-green-400 flex items-center gap-1 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>PASS
                    </span>
                ) : (
                    <span className="text-red-400 flex items-center gap-1 font-bold bg-red-500/10 px-1.5 py-0.5 rounded" title={ifraDetails}>
                         <AlertTriangle className="w-3 h-3" /> FAIL
                    </span>
                )}
            </div>
            <div className="h-3 w-px bg-slate-800"></div>
            <div className="flex items-center gap-2 max-w-[60%] truncate">
                <span className="text-amber-500/80 uppercase tracking-wide">Profile:</span>
                <span className="text-slate-300" title={profileStr}>{profileStr || "Analyzing..."}</span>
            </div>
        </div>

        {/* Output Port for the Group (Accord Output) */}
        <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-amber-500 bg-zinc-950 hover:bg-amber-500 transition-colors cursor-crosshair z-20 shadow-[0_0_10px_rgba(245,158,11,0.5)] pointer-events-auto"
            title={`Accord Output: ${group.label}`}
        />
    </div>
  )
}
