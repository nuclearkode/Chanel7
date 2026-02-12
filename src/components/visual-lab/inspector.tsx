import React from 'react'
import { VisualNode } from './types'
import { Info, BarChart3, List, Settings, Leaf, FlaskConical, Droplet } from 'lucide-react'
import { cn } from "@/lib/utils"

interface InspectorProps {
  selectedNode: VisualNode | null
}

export function InspectorComponent({ selectedNode }: InspectorProps) {
  if (!selectedNode) {
    return (
      <aside className="w-96 bg-zinc-900 border-l border-slate-700 flex flex-col z-30 shadow-xl h-full p-6 items-center justify-center text-slate-500">
        <Info className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select a node to inspect properties and impact.</p>
      </aside>
    )
  }

  const { data, type } = selectedNode

  return (
    <aside className="w-96 bg-zinc-900 border-l border-slate-700 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-5 border-b border-slate-700 bg-zinc-950/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white">{data.label}</h2>
          <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded border border-primary/20 uppercase tracking-wider">
            {type === 'accord' ? 'Macro Node' : 'Ingredient'}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {data.description || "No description available."}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 space-y-6">

        {/* Ingredient Specifics */}
        {type === 'ingredient' && data.ingredient && (
            <>
                <div className="bg-zinc-950 rounded-xl border border-slate-700 p-4 relative overflow-hidden">
                    <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Molecule Data</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">CAS Number</div>
                            <div className="text-sm font-mono text-slate-200">{data.ingredient.casNumber || "N/A"}</div>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Longevity</div>
                            <div className="text-sm font-mono text-slate-200">{data.ingredient.longevity}h</div>
                        </div>
                         <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Impact</div>
                            <div className="text-sm font-mono text-slate-200">{data.ingredient.impact}/100</div>
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">IFRA Limit</div>
                            <div className="text-sm font-mono text-slate-200">{data.ingredient.ifraLimit}%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-950 rounded-xl border border-slate-700 p-4">
                    <h3 className="text-xs font-mono uppercase text-slate-500 mb-4">Olfactory Profile</h3>
                    <div className="space-y-3">
                        {data.ingredient.olfactiveFamilies.map((fam, i) => (
                             <div key={fam} className="flex items-center gap-3">
                                <span className="text-xs text-slate-400 w-16 text-right">{fam}</span>
                                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", i === 0 ? "bg-primary shadow-[0_0_10px_rgba(17,164,212,0.5)]" : "bg-slate-600")}
                                        style={{ width: `${i === 0 ? 80 : 40}%` }}
                                    ></div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            </>
        )}

        {/* Accord Specifics */}
        {type === 'accord' && (
            <div className="bg-zinc-950 rounded-xl border border-slate-700 p-4">
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
      <div className="p-4 border-t border-slate-700 bg-zinc-950/80 backdrop-blur">
         <button className="w-full py-2 bg-primary hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            Edit Properties
         </button>
      </div>
    </aside>
  )
}
