"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { IngredientCard } from "@/components/inventory/ingredient-card"
import { IngredientDetailsPanel } from "@/components/inventory/ingredient-details-panel"
import { FiltersBar } from "@/components/inventory/filters-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Plus, LayoutGrid, Globe } from "lucide-react"
import { usePerfume } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { type Ingredient } from "@/lib/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SupplyGlobe } from "@/components/inventory/supply-globe"

export default function InventoryPage() {
  const { state, dispatch } = usePerfume()
  const { toast } = useToast()

  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState("grid")

  const ingredients = React.useMemo(() => {
    let all = state.inventory;
    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      all = all.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.vendor.toLowerCase().includes(q) ||
        i.note.toLowerCase().includes(q)
      )
    }
    // Filter by Tag
    if (activeFilter) {
      if (activeFilter === "Top Notes") all = all.filter(i => i.note === "Top")
      if (activeFilter === "Heart Notes") all = all.filter(i => i.note === "Mid")
      if (activeFilter === "Base Notes") all = all.filter(i => i.note === "Base")
      if (activeFilter === "Solvents") all = all.filter(i => i.vendor === "Solvent" || i.name.includes("Alcohol"))
    }
    return all
  }, [state.inventory, searchQuery, activeFilter])

  const selectedIngredient = ingredients.find(i => i.id === selectedId) || null

  const handleAddToFormula = (e: React.MouseEvent, ingredient: Ingredient) => {
    e.stopPropagation() // Prevent card selection
    dispatch({ type: "ADD_TO_FORMULA", payload: ingredient })
    toast({
        title: "Ingredient Added",
        description: `${ingredient.name} added to ${state.activeFormula.name}`,
    })
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 overflow-hidden relative h-screen">
            {/* Left Section: Search & Grid */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 bg-background/50">
              <Tabs defaultValue="grid" value={viewMode} onValueChange={setViewMode} className="flex-1 flex flex-col overflow-hidden">
                {/* Sticky Top Bar */}
                <div className="p-6 pb-4 bg-background/95 backdrop-blur-sm sticky top-0 z-20 border-b border-border/50">
                  <div className="max-w-7xl mx-auto w-full space-y-4">
                    {/* Title & Stats */}
                    <div className="flex justify-between items-end">
                      <div>
                        <h1 className="text-2xl font-bold font-display text-foreground">Ingredients Library</h1>
                        <p className="text-sm text-muted-foreground mt-1">Browse {ingredients.length} olfactory materials and bases.</p>
                      </div>
                      <div className="flex gap-2">
                        <TabsList className="h-8">
                           <TabsTrigger value="grid" className="text-xs h-6 px-2"><LayoutGrid className="w-3 h-3 mr-1"/> List</TabsTrigger>
                           <TabsTrigger value="map" className="text-xs h-6 px-2"><Globe className="w-3 h-3 mr-1"/> Map</TabsTrigger>
                        </TabsList>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                          <Upload className="w-3 h-3" /> Import
                        </Button>
                        <Button size="sm" className="h-8 text-xs gap-2 shadow-lg shadow-primary/20">
                          <Plus className="w-3 h-3" /> New Material
                        </Button>
                      </div>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          className="pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border-transparent focus:bg-background w-full text-sm"
                          placeholder="Search name, scent profile, CAS number..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <FiltersBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <TabsContent value="grid" className="flex-1 overflow-y-auto p-6 custom-scrollbar mt-0 border-0">
                  <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-20">
                    {ingredients.map(ingredient => (
                      <div key={ingredient.id} className="relative">
                          <IngredientCard
                            ingredient={ingredient}
                            isSelected={selectedId === ingredient.id}
                            onClick={() => setSelectedId(ingredient.id)}
                          />
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map" className="flex-1 overflow-hidden mt-0 border-0 relative">
                   <SupplyGlobe ingredients={ingredients} />
                </TabsContent>
              </Tabs>
            </main>

            {/* Right Side Panel / Detailed View */}
            <IngredientDetailsPanel ingredient={selectedIngredient} onAdd={() => selectedIngredient && handleAddToFormula({ stopPropagation: () => {} } as any, selectedIngredient)} />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
