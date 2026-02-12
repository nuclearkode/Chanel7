import React from 'react'
import { FlaskConical, Minus, Plus, Crosshair } from 'lucide-react'

export function NetworkGraph() {
  return (
    <section className="flex-1 relative bg-background overflow-hidden" style={{
      backgroundImage: `linear-gradient(to right, rgba(17, 164, 212, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(17, 164, 212, 0.05) 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }}>
      {/* SVG Connections Layer */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Lines from Center */}
        <line stroke="#11a4d4" strokeOpacity="0.3" strokeWidth="1" x1="50%" x2="30%" y1="50%" y2="30%"></line>
        <line stroke="#11a4d4" strokeOpacity="0.3" strokeWidth="1" x1="50%" x2="70%" y1="50%" y2="25%"></line>
        <line stroke="#11a4d4" strokeOpacity="0.3" strokeWidth="1" x1="50%" x2="75%" y1="50%" y2="65%"></line>
        <line stroke="#11a4d4" strokeOpacity="0.3" strokeWidth="1" x1="50%" x2="25%" y1="50%" y2="70%"></line>
        {/* Secondary Connections */}
        <line stroke="#11a4d4" strokeDasharray="4" strokeOpacity="0.1" strokeWidth="1" x1="30%" x2="20%" y1="30%" y2="20%"></line>
        <line stroke="#11a4d4" strokeDasharray="4" strokeOpacity="0.1" strokeWidth="1" x1="70%" x2="80%" y1="25%" y2="15%"></line>
      </svg>

      {/* Center Node (Master Perfumer) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative w-24 h-24 rounded-full bg-background border-2 border-primary shadow-[0_0_30px_rgba(17,164,212,0.3)] flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(17,164,212,0.6)]">
           {/* Pulse Ring */}
           <div className="absolute inset-0 rounded-full border border-primary animate-pulse opacity-50 scale-110"></div>
           <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center">
             <span className="text-2xl font-bold text-muted-foreground">JCE</span>
             {/* Replace with Image if available */}
           </div>
        </div>
        <div className="mt-4 bg-background/80 backdrop-blur border border-primary/30 px-3 py-1 rounded text-primary text-sm font-bold tracking-widest uppercase">
           Jean-Claude Ellena
        </div>
      </div>

      {/* Satellite Node 1 (Active/Selected) */}
      <div className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer">
        <div className="relative w-16 h-16 rounded-full bg-background border-2 border-primary shadow-[0_0_20px_rgba(17,164,212,0.5)] flex items-center justify-center transition-all group-hover:scale-110">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20"></div>
          <FlaskConical className="text-primary w-6 h-6" />
        </div>
        <div className="mt-2 text-center">
          <div className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-xs font-bold uppercase shadow-[0_0_15px_rgba(17,164,212,0.5)]">
             Terre d&apos;Hermès
          </div>
          <span className="text-[10px] text-primary/70 font-mono">2006 • WOODY SPICY</span>
        </div>
      </div>

      {/* Satellite Node 2 */}
      <div className="absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 rounded-full bg-background border border-orange-400/50 shadow-[0_0_10px_rgba(251,146,60,0.2)] flex items-center justify-center">
          <span className="text-[10px] font-bold text-orange-400">JARDIN</span>
        </div>
        <div className="mt-2 bg-background/80 px-2 py-0.5 rounded border border-orange-400/30 text-[10px] text-orange-400 font-bold uppercase">
           Sur Le Nil
        </div>
      </div>

      {/* Satellite Node 3 */}
      <div className="absolute top-[65%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-background border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.2)] flex items-center justify-center">
           <span className="text-[8px] font-bold text-emerald-400">TEA</span>
        </div>
        <div className="mt-2 bg-background/80 px-2 py-0.5 rounded border border-emerald-400/30 text-[10px] text-emerald-400 font-bold uppercase">
           Thé Vert
        </div>
      </div>

      {/* Satellite Node 4 */}
      <div className="absolute top-[70%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-background border border-muted-foreground/50 shadow-[0_0_10px_rgba(148,163,184,0.2)] flex items-center justify-center">
           <span className="text-[8px] font-bold text-muted-foreground">FIRST</span>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
           First (VC&A)
        </div>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-background/90 border border-primary/20 p-2 rounded-lg shadow-2xl backdrop-blur-md">
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/20 text-primary transition-colors">
          <Minus className="w-4 h-4" />
          <span className="sr-only">Zoom Out</span>
        </button>
        <div className="w-px h-full bg-primary/20"></div>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/20 text-primary transition-colors">
          <Plus className="w-4 h-4" />
          <span className="sr-only">Zoom In</span>
        </button>
        <div className="w-px h-full bg-primary/20"></div>
        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/20 text-primary transition-colors">
          <Crosshair className="w-4 h-4" />
          <span className="sr-only">Center</span>
        </button>
      </div>
    </section>
  )
}
