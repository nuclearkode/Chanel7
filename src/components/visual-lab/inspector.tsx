import React, { useState, useEffect } from 'react'
import { VisualNode, Connection, AccordGroup } from './types'
import { Info, Settings, AlertTriangle, CheckCircle, Sparkles, BrainCircuit, Unplug, Zap, Activity } from 'lucide-react'
import { cn } from "@/lib/utils"
import { AiAnalysisPanel } from "./ai-analysis-panel"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { usePerfume } from "@/lib/store"

interface InspectorProps {
  selectionData: {
      type: 'single' | 'multi'
      node?: VisualNode
      nodes?: VisualNode[]
      group?: AccordGroup // New: Direct group selection
  } | null
  allNodes?: VisualNode[]
  allConnections?: Connection[]
  onUpdateConnection?: (id: string, updates: Partial<Connection>) => void
  onUpdateGroup?: (id: string, updates: Partial<AccordGroup>) => void // New Handler
}

const COLOR_PALETTE = [
  { label: 'Amber', value: 'bg-amber-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Rose', value: 'bg-rose-500' },
  { label: 'Cyan', value: 'bg-cyan-500' },
]

export function InspectorComponent({ selectionData, allNodes = [], allConnections = [], onUpdateConnection, onUpdateGroup }: InspectorProps) {
  const { dispatch, state } = usePerfume()
  const { activeFormula } = state

  // Handle concentration change
  const handleConcentrationChange = (node: VisualNode, newVal: number) => {
      if (node.type === 'ingredient' && node.data.ingredient) {
          // Calculate amount from percentage
          // targetTotal * percentage / 100
          const amount = (activeFormula.targetTotal || 100) * newVal / 100
          dispatch({
              type: "UPDATE_QUANTITY",
              payload: { ingredientId: node.data.ingredient.id, amount }
          })
      }
  }

  if (!selectionData) {
    return (
      <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar min-h-0">
         <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-cyan-900/10 to-transparent">
             <div className="flex items-center gap-2 mb-2">
                 <Activity className="w-5 h-5 text-cyan-400" />
                 <h2 className="text-lg font-light text-white tracking-tight">Formula Overview</h2>
             </div>
             <p className="text-sm text-slate-400 font-light">
                 {allNodes.length > 0
                   ? `Analyzing entire formula with ${allNodes.length} nodes.`
                   : "Formula is empty."}
             </p>
         </div>

         <div className="p-6 space-y-6">
             {allNodes.length > 0 ? (
                 <>
                    <AiAnalysisPanel nodes={allNodes} />
                    <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800/50">
                        Select individual nodes for detailed material inspection.
                    </div>
                 </>
             ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                    <Info className="w-8 h-8 mb-3 opacity-30" />
                    <p className="text-xs">Drag ingredients onto the canvas to begin.</p>
                 </div>
             )}
         </div>
      </aside>
    )
  }

  // --- Group Mode (New) ---
  if (selectionData.type === 'single' && selectionData.node?.type === 'accord' && selectionData.node.id) {
       // We can detect if it's a "Group" by checking if it's a macro node OR if we pass a group object directly.
       // The visual editor passes a constructed 'accord' node for groups.
       // Let's assume onUpdateGroup works with the ID.
       const node = selectionData.node
       const isMacro = true // It is a macro node representing the group

       return (
        <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar min-h-0">
             <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-amber-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-light text-white tracking-tight">Accord Settings</h2>
                </div>
                <p className="text-sm text-slate-400 font-light">Manage group properties.</p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase">Accord Name</label>
                    <input
                        type="text"
                        value={node.data.label}
                        onChange={(e) => onUpdateGroup && onUpdateGroup(node.id, { label: e.target.value })}
                        className="w-full bg-zinc-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-amber-500 outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-300 uppercase">Color Theme</label>
                    <div className="flex flex-wrap gap-2">
                        {COLOR_PALETTE.map(c => (
                            <button
                                key={c.value}
                                onClick={() => onUpdateGroup && onUpdateGroup(node.id, { color: c.value })}
                                className={cn(
                                    "w-6 h-6 rounded-full border border-transparent hover:scale-110 transition-transform",
                                    c.value.replace('bg-', 'bg-'), // ensure tailwind keeps it
                                    node.data.color === c.value ? "ring-2 ring-white border-zinc-900" : ""
                                )}
                                style={{ backgroundColor: `var(--${c.value.replace('bg-', '')})` }} // Fallback if needed, but classes work if safelisted
                            >
                                <div className={cn("w-full h-full rounded-full", c.value)}></div>
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Existing Group Radar Chart */}
                 <div className="bg-zinc-900/50 rounded-xl border border-slate-800 p-4 mt-6">
                     <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Group Delta Analysis</h3>
                     <div className="h-48 w-full mb-6 relative -ml-4">
                         <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="65%" data={
                                (() => {
                                    if (!node.data.items) return []
                                    const sum: Record<string, number> = {}
                                    const totalParts = node.data.items.reduce((s, n) => s + (n.data.concentration || 0), 0) || 1
                                    node.data.items.forEach(n => {
                                        const prof = n.data.ingredient?.olfactoryProfile || n.data.ingredient?.olfactiveFamilies?.reduce((acc, f) => ({...acc, [f]: 50}), {}) || {}
                                        const weight = n.data.concentration || 0
                                        Object.entries(prof).forEach(([k, v]) => {
                                            sum[k] = (sum[k] || 0) + (v * weight)
                                        })
                                    })
                                    return Object.entries(sum)
                                        .map(([subject, val]) => ({ subject, A: Math.round(val / totalParts), fullMark: 100 }))
                                        .sort((a, b) => b.A - a.A)
                                        .slice(0, 6)
                                })()
                            }>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Radar name="Current" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                            </RadarChart>
                         </ResponsiveContainer>
                     </div>
                 </div>
            </div>
        </aside>
       )
  }


    // --- Multi-Select / AI Insight Mode ---
  if (selectionData.type === 'multi' && selectionData.nodes) {
      const nodes = selectionData.nodes

      // Check for connection between exactly 2 nodes
      let activeConnection: Connection | undefined
      if (nodes.length === 2) {
          activeConnection = allConnections.find(c =>
              (c.source === nodes[0].id && c.target === nodes[1].id) ||
              (c.source === nodes[1].id && c.target === nodes[0].id)
          )
      }

      return (
        <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar min-h-0">
            <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-purple-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-light text-white tracking-tight">AI Insight</h2>
                </div>
                <p className="text-sm text-slate-400 font-light">Analyzing interaction between {nodes.length} selected components.</p>
            </div>

            <div className="p-6 space-y-6">

                {/* Connection Editor */}
                {activeConnection && onUpdateConnection && (
                    <div className="bg-zinc-900/50 border border-slate-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>Active Link</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            {['blend', 'boost', 'suppress'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => onUpdateConnection(activeConnection!.id, { type: t as any })}
                                    className={cn(
                                        "px-2 py-1.5 text-xs rounded border capitalize transition-colors",
                                        activeConnection?.type === t
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-zinc-900 border-slate-700 text-slate-400 hover:text-slate-200"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-2">
                             <div className="flex justify-between text-xs text-slate-400">
                                 <span>Strength</span>
                                 <span>{Math.round((activeConnection.strength || 0.5) * 100)}%</span>
                             </div>
                             <Slider
                                min={0} max={1} step={0.1}
                                value={[activeConnection.strength || 0.5]}
                                onValueChange={(val) => onUpdateConnection(activeConnection!.id, { strength: val[0] })}
                                className="w-full"
                             />
                        </div>
                    </div>
                )}

                <AiAnalysisPanel key={nodes.map(n => n.id).join(',')} nodes={nodes} />

                <div>
                    <h3 className="text-xs font-mono uppercase text-slate-500 mb-3">Selected Components</h3>
                    <div className="space-y-2">
                        {nodes.map(n => (
                            <div key={n.id} className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-slate-800">
                                <span className="text-sm text-slate-300">{n.data.label}</span>
                                <span className="text-xs font-mono text-slate-500">{n.data.concentration?.toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
      )
  }

  // --- Single Node Mode (Ingredient) ---
  const selectedNode = selectionData.node
  if (!selectedNode) return null // Should not happen given check above

  const { data, type } = selectedNode
  const ingredient = data.ingredient

  // Helper for spectrum
  const getProfile = () => {
      if (ingredient?.olfactoryProfile) {
          return Object.entries(ingredient.olfactoryProfile).sort((a,b) => b[1] - a[1])
      }
      if (ingredient?.olfactiveFamilies) {
          return ingredient.olfactiveFamilies.map(f => [f, 50] as [string, number])
      }
      return []
  }
  const profile = getProfile()

  return (
    <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar min-h-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-light text-white tracking-tight">{data.label}</h2>
          <span className={cn(
              "px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider",
              "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
          )}>
            Natural
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed font-light">
          {data.description || ingredient?.description || "No description available."}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">

        {/* Concentration Slider */}
        {type === 'ingredient' && (
            <div className="bg-zinc-900/50 p-4 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Concentration</span>
                    <span className="text-sm font-mono text-cyan-400">{data.concentration?.toFixed(2)}%</span>
                </div>
                <Slider
                    min={0} max={100} step={0.1}
                    value={[data.concentration || 0]}
                    onValueChange={(val) => handleConcentrationChange(selectedNode, val[0])}
                    className="w-full"
                />
            </div>
        )}

        {/* Ingredient Specifics */}
        {type === 'ingredient' && ingredient && (
            <>
                <div className="border-b border-slate-800 pb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-mono uppercase text-slate-500">Molecule Preview (Major)</h3>
                        <span className="text-xs text-cyan-500 font-mono">
                            {ingredient.casNumber ? `CAS: ${ingredient.casNumber}` : "Unknown"}
                        </span>
                    </div>

                    <div className="h-32 w-full bg-zinc-900 rounded border border-slate-800 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,164,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,164,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                        <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-60 stroke-slate-400 fill-none stroke-2">
                             <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" />
                             <circle cx="50" cy="50" r="15" />
                        </svg>
                        <span className="absolute bottom-2 right-2 text-[10px] text-slate-600 font-mono">
                            {ingredient.smiles ? "Structure Data Available" : "Structure Data Missing"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Flash Point</div>
                            <div className="text-sm font-mono text-slate-200">{ingredient.flashPoint ? `${ingredient.flashPoint}°C` : "N/A"}</div>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Vapor Pressure</div>
                            <div className="text-sm font-mono text-slate-200">{ingredient.vaporPressure ? `${ingredient.vaporPressure} mmHg` : "N/A"}</div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-slate-800 pb-6">
                    <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Olfactory Profile</h3>
                    <div className="space-y-3">
                        {profile.map(([fam, val], i) => (
                             <div key={fam} className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-16 text-right">{fam}</span>
                                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500",
                                            i === 0 ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" :
                                            i === 1 ? "bg-amber-500" :
                                            "bg-slate-600"
                                        )}
                                        style={{ width: `${val}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-mono text-slate-500 w-8">{val}</span>
                             </div>
                        ))}
                    </div>
                </div>

                <div>
                     <h3 className="text-xs font-mono uppercase text-slate-500 mb-4 flex items-center gap-2">
                        IFRA Status (51st Amend.)
                        {((data.concentration || 0) > (ingredient.ifraLimit || 100)) ? (
                            <AlertTriangle className="text-amber-500 w-4 h-4" />
                        ) : (
                             <CheckCircle className="text-green-500 w-4 h-4" />
                        )}
                    </h3>

                    {ingredient.isAllergen && (
                         <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 mb-4 flex items-start gap-2">
                             <AlertTriangle className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
                             <div className="text-xs text-amber-200/80 leading-relaxed">
                                Contains restricted materials (Cat. 4). Ensure compliance.
                             </div>
                         </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs py-2 border-b border-slate-800">
                            <span className="text-slate-400">Category 4 Limit</span>
                            <span className="font-mono text-white">{ingredient.ifraLimit || 100}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-2 border-b border-slate-800">
                            <span className="text-slate-400">Current Contribution</span>
                            <span className={cn("font-mono", (data.concentration || 0) > (ingredient.ifraLimit || 100) ? "text-red-400" : "text-green-400")}>
                                {data.concentration?.toFixed(2)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-2">
                            <span className="text-slate-400">Status</span>
                             {((data.concentration || 0) > (ingredient.ifraLimit || 100)) ? (
                                <span className="font-mono text-red-500 bg-red-500/10 px-2 py-0.5 rounded">FAIL</span>
                             ) : (
                                <span className="font-mono text-green-500 bg-green-500/10 px-2 py-0.5 rounded">PASS</span>
                             )}
                        </div>
                    </div>
                </div>
            </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-zinc-950/80 backdrop-blur">
         <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            Edit Properties
         </button>
      </div>
    </aside>
  )
}
