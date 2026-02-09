"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LayoutGrid, List, Package, AlertTriangle, TrendingDown, DollarSign } from "lucide-react"
import { dummyIngredients, allFormulas } from "@/lib/data"
import { IngredientCard } from "@/components/inventory/ingredient-card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Ingredient } from "@/lib/types"

export default function SourcingLabPage() {
    const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
    const ingredients = dummyIngredients

    // Mock stock data
    const getStockLevel = (name: string) => (name.length * 7) % 100
    const lowStockItems = ingredients.filter(i => getStockLevel(i.name) < 25)
    const totalValue = ingredients.reduce((acc, i) => acc + (i.cost * getStockLevel(i.name)), 0)

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                            <Package className="w-6 h-6" />
                        </span>
                        Sourcing Lab
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage inventory, suppliers, and costs</p>
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4 mr-2" /> List
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4 mr-2" /> Grid
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500 text-white">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{ingredients.length}</p>
                                <p className="text-xs text-muted-foreground">Total Materials</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500 text-white">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{lowStockItems.length}</p>
                                <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500 text-white">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${totalValue.toFixed(0)}</p>
                                <p className="text-xs text-muted-foreground">Inventory Value</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500 text-white">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">3</p>
                                <p className="text-xs text-muted-foreground">Expiring Soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stock Level Bars */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Stock Levels</CardTitle>
                    <CardDescription>Quick overview of inventory status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {ingredients.slice(0, 12).map(ing => {
                            const level = getStockLevel(ing.name)
                            return (
                                <div key={ing.id} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="truncate font-medium">{ing.name}</span>
                                        <span className="text-muted-foreground">{level}%</span>
                                    </div>
                                    <Progress
                                        value={level}
                                        className={`h-2 ${level < 25 ? '[&>div]:bg-red-500' : level < 50 ? '[&>div]:bg-amber-500' : ''}`}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Inventory */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {ingredients.map((ingredient) => (
                        <IngredientCard key={ingredient.id} ingredient={ingredient} />
                    ))}
                </div>
            ) : (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Cost/g</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>IFRA Limit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ingredients.map((ingredient: Ingredient) => (
                                <TableRow key={ingredient.id}>
                                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                                    <TableCell>{ingredient.vendor}</TableCell>
                                    <TableCell>${ingredient.cost.toFixed(3)}</TableCell>
                                    <TableCell><Badge variant="outline">{ingredient.note}</Badge></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={getStockLevel(ingredient.name)} className="w-16 h-2" />
                                            <span className="text-xs">{getStockLevel(ingredient.name)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{ingredient.ifraLimit}%</span>
                                            {ingredient.isAllergen && <Badge variant="destructive">Allergen</Badge>}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    )
}
