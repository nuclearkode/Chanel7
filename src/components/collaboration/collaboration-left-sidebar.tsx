import React from 'react'
import { Search } from 'lucide-react'

export function CollaborationLeftSidebar() {
  return (
    <aside className="w-72 bg-background/50 border-r border-primary/10 flex flex-col z-10 backdrop-blur-sm">
      <div className="p-4 border-b border-primary/10">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-primary/50 w-4 h-4" />
          <input
            className="w-full bg-primary/5 border border-primary/20 rounded-lg py-2 pl-9 pr-3 text-xs text-primary focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 placeholder-primary/30 font-mono uppercase"
            placeholder="SEARCH NODE ID..."
            type="text"
            aria-label="Search Node ID"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Filter Group 1 */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-3 font-bold">Design Language</h3>
          <div className="space-y-1">
            <label className="flex items-center justify-between group cursor-pointer p-2 hover:bg-primary/5 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full border border-primary bg-primary shadow-[0_0_8px_rgba(17,164,212,0.6)]"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-primary">Minimalist</span>
              </div>
              <span className="text-[10px] font-mono text-primary/50">14</span>
            </label>
            <label className="flex items-center justify-between group cursor-pointer p-2 hover:bg-primary/5 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full border border-orange-400 bg-orange-400/20"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-orange-400">Citrus-Forward</span>
              </div>
              <span className="text-[10px] font-mono text-primary/50">08</span>
            </label>
            <label className="flex items-center justify-between group cursor-pointer p-2 hover:bg-primary/5 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full border border-emerald-400 bg-emerald-400/20"></div>
                <span className="text-xs font-medium text-foreground group-hover:text-emerald-400">Green Tea</span>
              </div>
              <span className="text-[10px] font-mono text-primary/50">05</span>
            </label>
          </div>
        </div>
        {/* Filter Group 2 */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary/60 mb-3 font-bold">Chronology</h3>
          <div className="relative h-32 border-l border-primary/20 ml-2 my-2">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary"></div>
            <div className="absolute -left-[5px] bottom-0 w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary"></div>
            <div className="absolute left-4 top-0 text-[10px] text-primary/70">2023</div>
            <div className="absolute left-4 bottom-0 text-[10px] text-primary/70">1976</div>
            {/* Range Slider Mockup */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-primary/30"></div>
            <div className="absolute -left-[3px] top-8 w-2 h-4 bg-primary rounded shadow-lg shadow-primary/50"></div>
            <div className="absolute -left-[3px] bottom-8 w-2 h-4 bg-primary rounded shadow-lg shadow-primary/50"></div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-primary/10">
        <div className="bg-primary/5 rounded p-3 border border-primary/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase text-primary/70 font-bold">Processing Power</span>
            <span className="text-[10px] font-mono text-primary">84%</span>
          </div>
          <div className="w-full bg-primary/10 rounded-full h-1">
            <div className="bg-primary h-1 rounded-full w-[84%] shadow-[0_0_10px_rgba(17,164,212,0.5)]"></div>
          </div>
        </div>
      </div>
    </aside>
  )
}
