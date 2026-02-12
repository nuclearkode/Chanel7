import React from 'react'
import { usePerfume } from "@/lib/store"
import { Search, GripVertical, Beaker, Leaf, Zap, Droplet } from 'lucide-react'
import { Ingredient } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onDragStart: (e: React.DragEvent, ingredient: Ingredient) => void
}

export function SidebarComponent({ onDragStart }: SidebarProps) {
  const { state } = usePerfume()
  const { inventory } = state
  const [search, setSearch] = React.useState("")
  const [filter, setFilter] = React.useState<"All" | "Natural" | "Synthetic">("All")

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false

    // Simple heuristic for Natural/Synthetic based on available data or just mock for now
    // The current data doesn't strictly have "Natural" flag but has "vendor" or "olfactiveFamilies".
    // I'll assume everything is mixed for now, or use "Natural" vendor as proxy if I had it.
    // For now just search filter.
    return true
  })

  // Grouping by "Natural" vs "Synthetic" based on some logic if possible.
  // Let's just list them flat for now.

  return (
    <aside className="w-80 bg-zinc-900 border-r border-slate-700 flex flex-col z-10 shadow-xl h-full">
      <div className="p-4 border-b border-slate-700 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            className="w-full bg-zinc-950 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600 text-slate-200"
            placeholder="Search molecule database..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {["All", "Floral", "Woody", "Amber", "Musk"].map(f => (
            <button
              key={f}
              className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 whitespace-nowrap transition-colors"
              onClick={() => setSearch(f === "All" ? "" : f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         {filteredInventory.map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              className="group flex items-center gap-3 p-3 rounded-lg bg-zinc-950/50 border border-transparent hover:border-primary/50 hover:bg-primary/5 cursor-grab active:cursor-grabbing transition-all"
            >
              <div className={cn(
                  "h-10 w-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400",
                  // Color coding based on family
                  item.olfactiveFamilies.includes("Floral") ? "text-pink-500 bg-pink-500/10 border-pink-500/20" : "",
                  item.olfactiveFamilies.includes("Woody") ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "",
                  item.olfactiveFamilies.includes("Citrus") ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" : "",
                  item.olfactiveFamilies.includes("Green") ? "text-green-500 bg-green-500/10 border-green-500/20" : "",
              )}>
                 <Leaf className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-slate-200 truncate" title={item.name}>{item.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{item.note}</span>
                  <span className="text-[10px] text-slate-500 truncate">{item.olfactiveFamilies.join("-")}</span>
                </div>
              </div>
              <GripVertical className="text-slate-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
            </div>
         ))}
      </div>
    </aside>
  )
}
