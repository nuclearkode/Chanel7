"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiltersBarProps {
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
}

export function FiltersBar({ activeFilter, setActiveFilter }: FiltersBarProps) {
  const filters = ["Top Notes", "Heart Notes", "Base Notes", "Solvents"]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground mr-2">Filters:</span>

      <Button
        variant="outline"
        size="sm"
        className={cn(
          "rounded-full text-xs font-medium border transition-all h-8",
          activeFilter === null ? "bg-primary/20 text-primary border-primary/30" : "bg-card hover:border-primary/50 text-muted-foreground"
        )}
        onClick={() => setActiveFilter(null)}
      >
        {activeFilter === null && <Check className="w-3 h-3 mr-1" />} All
      </Button>

      {filters.map(filter => (
        <Button
          key={filter}
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full text-xs font-medium border transition-all h-8",
            activeFilter === filter ? "bg-primary/20 text-primary border-primary/30" : "bg-card hover:border-primary/50 text-muted-foreground"
          )}
          onClick={() => setActiveFilter(filter === activeFilter ? null : filter)}
        >
          {activeFilter === filter && <Check className="w-3 h-3 mr-1" />} {filter}
        </Button>
      ))}

      <div className="w-px h-6 bg-border mx-1"></div>

      <Button variant="outline" size="sm" className="rounded-full text-xs font-medium bg-card border hover:border-primary/50 text-muted-foreground transition-all flex items-center gap-1 h-8">
        <Filter className="w-3 h-3" /> More
      </Button>
    </div>
  )
}
