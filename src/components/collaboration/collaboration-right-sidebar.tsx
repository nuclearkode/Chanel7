import React from 'react'
import { X, BarChart3, GitBranch, FlaskConical } from 'lucide-react'

export function CollaborationRightSidebar() {
  return (
    <aside className="w-96 bg-background/95 border-l border-primary/20 flex flex-col z-20 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Panel Header */}
      <div className="p-6 border-b border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between mb-2">
          <span className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold tracking-widest border border-primary/30 uppercase">Selected Node</span>
          <button className="text-primary/50 hover:text-primary">
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <h2 className="text-2xl font-bold text-foreground uppercase leading-none mb-1">Terre d&apos;Hermès</h2>
        <div className="flex items-center gap-2 text-primary/60 font-mono text-xs">
          <span>ID: TDH-2006-FR</span>
          <span>•</span>
          <span>MASTERPIECE STATUS</span>
        </div>
      </div>
      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Section 1: Data Chips */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Technical Specs
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded bg-muted/50 border border-border text-xs text-muted-foreground flex flex-col items-start min-w-[80px]">
              <span className="text-[9px] text-muted-foreground/70 uppercase">Concentration</span>
              <span className="font-bold text-foreground">Eau de Toilette</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-xs text-primary flex flex-col items-start min-w-[80px]">
              <span className="text-[9px] text-primary/60 uppercase">Iso E Super</span>
              <span className="font-bold">55% Volume</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-muted/50 border border-border text-xs text-muted-foreground flex flex-col items-start min-w-[80px]">
              <span className="text-[9px] text-muted-foreground/70 uppercase">Year</span>
              <span className="font-bold text-foreground">2006</span>
            </div>
            <div className="px-3 py-1.5 rounded bg-muted/50 border border-border text-xs text-muted-foreground flex flex-col items-start min-w-[80px]">
              <span className="text-[9px] text-muted-foreground/70 uppercase">Family</span>
              <span className="font-bold text-foreground">Woody Chypre</span>
            </div>
          </div>
        </div>
        {/* Section 2: Accord Composition (Bar Chart Style) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Olfactory Profile
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                <span>Citrus (Grapefruit/Orange)</span>
                <span className="text-foreground">High</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                <span>Mineral / Flint</span>
                <span className="text-foreground">Medium-High</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-slate-400 to-slate-200 w-[70%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                <span>Woody (Cedar/Vetiver)</span>
                <span className="text-foreground">Very High</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-cyan-300 w-[95%] shadow-[0_0_10px_rgba(17,164,212,0.4)]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] uppercase text-muted-foreground mb-1">
                <span>Spices (Pepper)</span>
                <span className="text-foreground">Low</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 to-red-600 w-[30%]"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Section 3: Creative Lineage (Flowchart style) */}
        <div className="relative pt-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Creative Lineage
          </h3>
          <div className="relative pl-4 border-l border-dashed border-primary/30 space-y-6">
            {/* Ancestor */}
            <div className="relative group">
              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-primary bg-background"></div>
              <div className="bg-muted/30 hover:bg-muted/50 border border-border hover:border-primary/50 rounded p-3 transition-all cursor-pointer">
                <span className="block text-[9px] uppercase text-muted-foreground mb-1">Mentor / Influence</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">ER</div>
                  <span className="text-sm font-bold text-foreground">Edmond Roudnitska</span>
                </div>
              </div>
            </div>
            {/* Current Node indicator */}
            <div className="relative">
              <div className="absolute -left-[23px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow-[0_0_10px_#11a4d4]"></div>
              <div className="text-xs uppercase text-primary font-bold pl-2 tracking-widest">
                Current Node Logic
              </div>
            </div>
            {/* Descendant */}
            <div className="relative group">
              <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-primary bg-background"></div>
              <div className="bg-muted/30 hover:bg-muted/50 border border-border hover:border-primary/50 rounded p-3 transition-all cursor-pointer">
                <span className="block text-[9px] uppercase text-muted-foreground mb-1">Influenced</span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">CN</div>
                  <span className="text-sm font-bold text-foreground">Christine Nagel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Abstract Visual for Composition Blueprint footer */}
        <div className="mt-4 border border-primary/20 rounded h-24 relative overflow-hidden bg-background">
          <div className="absolute inset-0 w-full h-full opacity-20 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRwtXEBCgYQCCn4-Pcslbce4WpEwgPOrGJ6NNuBWwcUV9CHtssDDD-ZhKpWlLwtmFEzgKT0Q9l7N7ZZ_8zazBFXoS4o8HN3PwMvfNOERhsKxWuTaYqyBvysCP4XWiGFk6F0nra8sdTDCWJwa0veWnc5gJnPnuG0RL-Z7-XIQsx7dT9TIDjd-d3pm-d3v6LQfkIeC0Vk7bWPL9yER-eJz1PAg0nIyl_W34vCTUFNL67_7Dd6HWwJaCdXVPTByJvW-D1HLNaZyzWB5gy')] bg-cover mix-blend-screen"></div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-primary/60">
            SPECTROGRAPH_V.4.2 // RENDER_COMPLETE
          </div>
        </div>
      </div>
      {/* Panel Footer Actions */}
      <div className="p-4 border-t border-primary/20 bg-background/50">
        <button className="w-full bg-primary/20 hover:bg-primary hover:text-white text-primary border border-primary/50 font-bold py-2 px-4 rounded transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
          <FlaskConical className="w-4 h-4" />
          Load Formula
        </button>
      </div>
    </aside>
  )
}
