import React from 'react'
import { Share2, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CollaborationHeader() {
  return (
    <header className="h-16 border-b border-primary/20 bg-background/90 backdrop-blur-md flex items-center justify-between px-6 z-20 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary">
          <Share2 className="w-6 h-6" />
          <h1 className="font-bold tracking-widest text-lg uppercase">
            PerFume <span className="text-xs align-top opacity-70">INTEL</span>
          </h1>
        </div>
        <div className="h-6 w-px bg-primary/20 mx-2"></div>
        <nav className="flex text-xs uppercase tracking-wider text-muted-foreground gap-2">
          <span className="hover:text-primary cursor-pointer transition-colors">Database</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Masters</span>
          <span>/</span>
          <span className="text-primary font-bold">Ellena, J.C.</span>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-xs font-mono text-primary/60">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            SYS.ONLINE
          </span>
          <span>LATENCY: 12ms</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded hover:bg-primary/10 text-primary transition-colors border border-primary/20">
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </button>
          <button className="p-2 rounded hover:bg-primary/10 text-primary transition-colors border border-primary/20">
            <LogOut className="w-4 h-4" />
            <span className="sr-only">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
