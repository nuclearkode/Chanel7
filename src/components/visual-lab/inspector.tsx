import React from 'react'
import { VisualNode } from './types'
import { Info, Settings, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

interface InspectorProps {
  selectedNode: VisualNode | null
}

export function InspectorComponent({ selectedNode }: InspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full p-6 items-center justify-center text-slate-500">
        <Info className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select a node to inspect properties and impact.</p>
      </aside>
    )
  }

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
    <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-cyan-500/5 to-transparent">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-light text-white tracking-tight">{data.label}</h2>
          <span className={cn(
              "px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider",
              type === 'accord' ? "border-amber-500/30 text-amber-500 bg-amber-500/10" : "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
          )}>
            {type === 'accord' ? 'Macro Node' : 'Natural'}
            {/* Note: Logic to distinguish Natural/Synthetic would need ingredient metadata */}
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed font-light">
          {data.description || ingredient?.description || "No description available."}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">

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

                    {/* Molecule Visualization (Placeholder) */}
                    <div className="h-32 w-full bg-zinc-900 rounded border border-slate-800 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(17,164,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(17,164,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                        {/* Generic Benzene Ring SVG for demo */}
                        <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-60 stroke-slate-400 fill-none stroke-2">
                             <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" />
                             <circle cx="50" cy="50" r="15" />
                             {/* Just a dummy visual */}
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

        {/* Accord Specifics */}
        {type === 'accord' && (
            <div className="bg-zinc-950 rounded-xl border border-slate-800 p-4">
                 <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Group Delta Analysis</h3>

                 <div className="h-48 w-full mb-6 relative -ml-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={
                            (() => {
                                if (!data.items) return []
                                const sum: Record<string, number> = {}
                                const totalParts = data.items.reduce((s, n) => s + (n.data.concentration || 0), 0) || 1

                                data.items.forEach(n => {
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
                            <Radar name="Current" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                        </RadarChart>
                     </ResponsiveContainer>
                 </div>

                 <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Group Contents</h3>
                 <div className="space-y-2">
                    {data.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-slate-800 text-xs">
                            <span className="text-slate-300">{item.data.label}</span>
                            <span className="font-mono text-slate-500">{item.data.concentration?.toFixed(1)}%</span>
                        </div>
                    ))}
                    {!data.items?.length && <p className="text-xs text-slate-600 italic">Empty group</p>}
                 </div>
            </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-slate-800 bg-zinc-950/80 backdrop-blur">
         <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            Edit Properties
         </button>
      </div>
    </aside>
  )
}
