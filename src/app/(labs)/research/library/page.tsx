"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Grid, List, Eye } from "lucide-react"
import Link from "next/link"
import { allFormulas, olfactiveFamilies } from "@/lib/data"
import React from "react"

export default function LibraryPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedFamily, setSelectedFamily] = React.useState<string | null>(null)

    const filteredFormulas = allFormulas.filter(formula => {
        const matchesSearch = formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formula.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesFamily = !selectedFamily ||
            formula.ingredients.some(ing => ing.olfactiveFamilies.includes(selectedFamily as any))

        return matchesSearch && matchesFamily
    })

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Formula Library</h1>
                    <p className="text-muted-foreground mt-1">Browse and study existing formulas</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search formulas or ingredients..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant={selectedFamily === null ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFamily(null)}
                    >
                        All
                    </Button>
                    {olfactiveFamilies.slice(0, 6).map(family => (
                        <Button
                            key={family}
                            variant={selectedFamily === family ? "secondary" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFamily(family)}
                        >
                            {family}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Formula Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFormulas.map((formula) => {
                    const families = [...new Set(formula.ingredients.flatMap(ing => ing.olfactiveFamilies))]
                    const totalConc = formula.ingredients.reduce((acc, ing) => acc + ing.concentration, 0)

                    return (
                        <Card key={formula.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="font-headline text-lg">{formula.name}</CardTitle>
                                        <CardDescription>{formula.ingredients.length} ingredients</CardDescription>
                                    </div>
                                    <div className="text-3xl">🧪</div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Mini pyramid */}
                                <div className="flex gap-1 h-20">
                                    {['Top', 'Mid', 'Base'].map((note, i) => {
                                        const noteIngs = formula.ingredients.filter(ing => ing.note === note)
                                        const noteTotal = noteIngs.reduce((a, ing) => a + ing.concentration, 0)
                                        const height = Math.min(100, (noteTotal / totalConc) * 100 * 3)

                                        return (
                                            <div key={note} className="flex-1 flex flex-col justify-end">
                                                <div
                                                    className={`rounded-t transition-all ${note === 'Top' ? 'bg-yellow-400' :
                                                            note === 'Mid' ? 'bg-rose-400' : 'bg-amber-600'
                                                        }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className="text-[10px] text-center text-muted-foreground mt-1">{note}</span>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Families */}
                                <div className="flex flex-wrap gap-1">
                                    {families.slice(0, 3).map(fam => (
                                        <Badge key={fam} variant="secondary" className="text-xs">{fam}</Badge>
                                    ))}
                                    {families.length > 3 && (
                                        <Badge variant="outline" className="text-xs">+{families.length - 3}</Badge>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <Link href={`/creation?formula=${formula.id}`}>
                                            <Eye className="w-3 h-3 mr-1" /> View
                                        </Link>
                                    </Button>
                                    <Button size="sm" className="flex-1" asChild>
                                        <Link href={`/creation?formula=${formula.id}&edit=true`}>
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {filteredFormulas.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No formulas found matching your criteria
                </div>
            )}
        </div>
    )
}
