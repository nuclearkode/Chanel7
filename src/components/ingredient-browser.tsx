"use client"

import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, ArrowUpDown, Filter } from "lucide-react"
import { type Ingredient, type OlfactiveFamily } from "@/lib/types"
import { olfactiveFamilies } from "@/lib/data"
import { usePerfume } from "@/lib/store"
import { cn } from "@/lib/utils"

interface IngredientBrowserProps {
  onAdd: (ingredient: Ingredient) => void
}

export function IngredientBrowser({ onAdd }: IngredientBrowserProps) {
  const { state } = usePerfume()
  const inventory = state.inventory || []

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedFamilies, setSelectedFamilies] = useState<OlfactiveFamily[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Ingredient; direction: 'asc' | 'desc' } | null>(null)

  const toggleFamily = (family: OlfactiveFamily) => {
    setSelectedFamilies(prev =>
      prev.includes(family)
        ? prev.filter(f => f !== family)
        : [...prev, family]
    )
  }

  const handleSort = (key: keyof Ingredient) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null
      }
      return { key, direction: 'asc' }
    })
  }

  const filteredIngredients = useMemo(() => {
    let result = [...inventory]

    // Filter by search
    if (search) {
      const lowerSearch = search.toLowerCase()
      result = result.filter(ing =>
        ing.name.toLowerCase().includes(lowerSearch) ||
        ing.casNumber?.includes(lowerSearch) ||
        ing.description?.toLowerCase().includes(lowerSearch)
      )
    }

    // Filter by families (OR logic - contains ANY selected)
    if (selectedFamilies.length > 0) {
      result = result.filter(ing =>
        ing.olfactiveFamilies.some(f => selectedFamilies.includes(f))
      )
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
        }

        const aString = String(aValue || "")
        const bString = String(bValue || "")
        return sortConfig.direction === 'asc'
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString)
      })
    }

    return result
  }, [inventory, search, selectedFamilies, sortConfig])

  const handleSelect = (ingredient: Ingredient) => {
    onAdd(ingredient)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Ingredient Library
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b bg-muted/30 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, CAS, or description..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 mr-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                Families:
              </div>
              {olfactiveFamilies.map(family => (
                <Badge
                  key={family}
                  variant={selectedFamilies.includes(family) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 transition-colors"
                  onClick={() => toggleFamily(family)}
                >
                  {family}
                </Badge>
              ))}
              {selectedFamilies.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedFamilies([])} className="h-6 px-2 text-xs">
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[200px] cursor-pointer hover:bg-muted" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="w-[100px] cursor-pointer hover:bg-muted" onClick={() => handleSort('note')}>
                    <div className="flex items-center gap-1">Note <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead>Families</TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-muted" onClick={() => handleSort('longevity')}>
                    <div className="flex items-center justify-end gap-1">Longevity (h) <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-muted" onClick={() => handleSort('impact')}>
                    <div className="flex items-center justify-end gap-1">Impact <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="text-right cursor-pointer hover:bg-muted" onClick={() => handleSort('cost')}>
                    <div className="flex items-center justify-end gap-1">Cost <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIngredients.length > 0 ? (
                  filteredIngredients.map((ing) => (
                    <TableRow key={ing.id} className="group">
                      <TableCell className="font-medium">
                        <div>{ing.name}</div>
                        {ing.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]" title={ing.description}>
                            {ing.description}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">{ing.note}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ing.olfactiveFamilies.slice(0, 2).map(f => (
                            <span key={f} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">{f}</span>
                          ))}
                          {ing.olfactiveFamilies.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{ing.olfactiveFamilies.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{ing.longevity}</TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        <div className="flex items-center justify-end gap-2">
                           <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${ing.impact}%` }} />
                           </div>
                           {ing.impact}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">${ing.cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleSelect(ing)}>Add</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No ingredients found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t bg-muted/20 text-xs text-muted-foreground text-center">
            Showing {filteredIngredients.length} ingredients
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
