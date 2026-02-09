"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, AlertTriangle, CheckCircle2, FileText, Download, Globe } from "lucide-react"
import { allFormulas, dummyIngredients } from "@/lib/data"
import { AllergenGauge } from "@/components/charts/allergen-gauge"
import { ExportPanel } from "@/components/formulas/export-panel"

export default function ComplianceLabPage() {
    const currentFormula = allFormulas[0]

    // Mock compliance data
    const allergens = currentFormula.ingredients.filter(i => i.isAllergen)
    const ifraViolations = currentFormula.ingredients.filter(i => i.concentration > i.ifraLimit)
    const complianceScore = Math.max(0, 100 - (allergens.length * 5) - (ifraViolations.length * 15))

    const regions = [
        { name: "EU", status: ifraViolations.length === 0 ? "compliant" : "warning", icon: "🇪🇺" },
        { name: "USA", status: "compliant", icon: "🇺🇸" },
        { name: "Japan", status: "compliant", icon: "🇯🇵" },
        { name: "China", status: allergens.length > 3 ? "warning" : "compliant", icon: "🇨🇳" },
    ]

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </span>
                        Compliance Lab
                    </h1>
                    <p className="text-muted-foreground mt-1">IFRA regulations, allergen tracking, and exports</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" /> Generate Report
                    </Button>
                    <Button>
                        <Download className="w-4 h-4 mr-2" /> Export SDS
                    </Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={complianceScore >= 80
                    ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
                    : "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20"
                }>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg text-white ${complianceScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{complianceScore}%</p>
                                <p className="text-xs text-muted-foreground">Compliance Score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={ifraViolations.length === 0
                    ? "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20"
                    : "bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20"
                }>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg text-white ${ifraViolations.length === 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                {ifraViolations.length === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{ifraViolations.length}</p>
                                <p className="text-xs text-muted-foreground">IFRA Violations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500 text-white">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{allergens.length}</p>
                                <p className="text-xs text-muted-foreground">Allergens Detected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500 text-white">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{regions.filter(r => r.status === 'compliant').length}/{regions.length}</p>
                                <p className="text-xs text-muted-foreground">Regions Compliant</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* IFRA Limits */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">IFRA Limit Compliance</CardTitle>
                        <CardDescription>Ingredient concentrations vs regulatory limits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentFormula.ingredients.filter(i => i.note !== 'Top' || i.ifraLimit < 50).slice(0, 8).map(ing => {
                            const percentage = (ing.concentration / ing.ifraLimit) * 100
                            const isOver = percentage > 100
                            const isWarning = percentage > 75

                            return (
                                <div key={ing.id} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{ing.name}</span>
                                            {ing.isAllergen && <Badge variant="outline" className="text-xs">Allergen</Badge>}
                                        </div>
                                        <span className={isOver ? "text-red-500 font-bold" : isWarning ? "text-amber-500" : "text-muted-foreground"}>
                                            {ing.concentration.toFixed(1)}% / {ing.ifraLimit}%
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <Progress
                                            value={Math.min(100, percentage)}
                                            className={`h-3 ${isOver ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                                        />
                                        {/* Limit marker */}
                                        <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30" style={{ left: '100%' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Allergen Gauge */}
                <div className="space-y-6">
                    <AllergenGauge formula={currentFormula} />

                    {/* Region Compliance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Regional Compliance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {regions.map(region => (
                                    <div
                                        key={region.name}
                                        className={`p-3 rounded-lg border flex items-center gap-2 ${region.status === 'compliant'
                                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                                : 'bg-amber-500/10 border-amber-500/30'
                                            }`}
                                    >
                                        <span className="text-xl">{region.icon}</span>
                                        <div>
                                            <p className="font-medium text-sm">{region.name}</p>
                                            <p className={`text-xs ${region.status === 'compliant' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {region.status === 'compliant' ? '✓ Compliant' : '⚠ Review'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Export */}
            <ExportPanel formula={currentFormula} />
        </div>
    )
}
