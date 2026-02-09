"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Brain, Lightbulb, TrendingUp, Gamepad2, Library, Sparkles } from "lucide-react"
import Link from "next/link"
import { allFormulas, olfactiveFamilies } from "@/lib/data"

// Fragrance Wheel visualization data
const wheelData = olfactiveFamilies.map((family, i) => ({
    name: family,
    count: allFormulas.flatMap(f => f.ingredients).filter(ing => ing.olfactiveFamilies.includes(family)).length,
    angle: (i / olfactiveFamilies.length) * 360,
    color: [
        "bg-rose-500", "bg-amber-600", "bg-yellow-500", "bg-orange-500",
        "bg-red-500", "bg-green-500", "bg-pink-400", "bg-cyan-500",
        "bg-amber-400", "bg-purple-400", "bg-stone-500", "bg-emerald-700"
    ][i % 12]
}))

export default function ResearchLabPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            <Brain className="w-6 h-6" />
                        </span>
                        Research Lab
                    </h1>
                    <p className="text-muted-foreground mt-1">Learn, explore, and expand your olfactory knowledge</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/research/library"><Library className="w-4 h-4 mr-2" /> Browse Library</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/research/training"><Gamepad2 className="w-4 h-4 mr-2" /> Start Training</Link>
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500 text-white">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{allFormulas.length}</p>
                                <p className="text-xs text-muted-foreground">Formulas Studied</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500 text-white">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">73%</p>
                                <p className="text-xs text-muted-foreground">Training Progress</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500 text-white">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-xs text-muted-foreground">Saved Ideas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-500 text-white">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">8</p>
                                <p className="text-xs text-muted-foreground">Families Mastered</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fragrance Wheel */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Olfactive Wheel</CardTitle>
                        <CardDescription>Explore fragrance families and their relationships</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            {/* Wheel segments */}
                            <div className="absolute inset-0 rounded-full border-4 border-muted">
                                {wheelData.map((segment, i) => (
                                    <div
                                        key={segment.name}
                                        className="absolute top-1/2 left-1/2 origin-left"
                                        style={{
                                            transform: `rotate(${segment.angle}deg) translateX(40%)`,
                                        }}
                                    >
                                        <div
                                            className={`${segment.color} w-16 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                                            title={`${segment.name}: ${segment.count} ingredients`}
                                        >
                                            {segment.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Center */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-xl">
                                    <span className="text-xs font-medium text-center">12<br />Families</span>
                                </div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap gap-2 mt-6 justify-center">
                            {wheelData.slice(0, 6).map(s => (
                                <Badge key={s.name} variant="outline" className="text-xs">
                                    <span className={`w-2 h-2 rounded-full ${s.color} mr-1.5`}></span>
                                    {s.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Training Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Training Progress</CardTitle>
                        <CardDescription>Your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Note Identification</span>
                                <span className="text-muted-foreground">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Strength Comparison</span>
                                <span className="text-muted-foreground">62%</span>
                            </div>
                            <Progress value={62} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Accord Building</span>
                                <span className="text-muted-foreground">45%</span>
                            </div>
                            <Progress value={45} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Blending Theory</span>
                                <span className="text-muted-foreground">78%</span>
                            </div>
                            <Progress value={78} className="h-2" />
                        </div>

                        <Button className="w-full mt-4" asChild>
                            <Link href="/research/training">Continue Training</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recently Viewed */}
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recently Explored</CardTitle>
                    <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {allFormulas.map((formula) => (
                            <Link
                                key={formula.id}
                                href={`/creation?formula=${formula.id}`}
                                className="flex-shrink-0 w-48 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="text-2xl mb-2">🧪</div>
                                <h3 className="font-medium truncate">{formula.name}</h3>
                                <p className="text-xs text-muted-foreground">{formula.ingredients.length} ingredients</p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
