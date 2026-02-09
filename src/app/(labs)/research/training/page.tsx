"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComparisonGame } from "@/components/training/comparison-game"
import { AccordSuggestionTool } from "@/components/ai-tools/accord-suggestion-tool"
import { FixativeRecommendationTool } from "@/components/ai-tools/fixative-recommendation-tool"
import { SensitivityAdjustmentTool } from "@/components/ai-tools/sensitivity-adjustment-tool"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Music, Zap, Target } from "lucide-react"

export default function TrainingPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <Gamepad2 className="w-6 h-6" />
                    </span>
                    Training Center
                </h1>
                <p className="text-muted-foreground mt-1">Sharpen your olfactory skills with interactive exercises</p>
            </div>

            <Tabs defaultValue="game" className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-4">
                    <TabsTrigger value="game" className="flex items-center gap-2">
                        <Target className="w-4 h-4" /> Comparison
                    </TabsTrigger>
                    <TabsTrigger value="accord" className="flex items-center gap-2">
                        <Music className="w-4 h-4" /> Accords
                    </TabsTrigger>
                    <TabsTrigger value="fixative" className="flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Fixatives
                    </TabsTrigger>
                    <TabsTrigger value="sensitivity" className="flex items-center gap-2">
                        <Target className="w-4 h-4" /> Sensitivity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="game" className="mt-6">
                    <ComparisonGame />
                </TabsContent>

                <TabsContent value="accord" className="mt-6">
                    <AccordSuggestionTool />
                </TabsContent>

                <TabsContent value="fixative" className="mt-6">
                    <FixativeRecommendationTool />
                </TabsContent>

                <TabsContent value="sensitivity" className="mt-6">
                    <SensitivityAdjustmentTool />
                </TabsContent>
            </Tabs>
        </div>
    )
}
