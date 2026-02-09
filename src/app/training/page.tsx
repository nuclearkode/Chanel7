"use client"
import AppSidebar from "@/components/app-sidebar"
import { AccordSuggestionTool } from "@/components/ai-tools/accord-suggestion-tool"
import { FixativeRecommendationTool } from "@/components/ai-tools/fixative-recommendation-tool"
import { SensitivityAdjustmentTool } from "@/components/ai-tools/sensitivity-adjustment-tool"
import { ComparisonGame } from "@/components/training/comparison-game"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrainingPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset>
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                        <h1 className="text-3xl font-bold text-foreground font-headline mb-6">AI Training Ground</h1>
                        <Tabs defaultValue="game" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="game">Comparison Game</TabsTrigger>
                                <TabsTrigger value="accord">Accord Suggestion</TabsTrigger>
                                <TabsTrigger value="fixative">Fixative Tool</TabsTrigger>
                                <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
                            </TabsList>
                            <TabsContent value="game" className="mt-6">
                                <ComparisonGame />
                            </TabsContent>
                            <TabsContent value="accord">
                                <AccordSuggestionTool />
                            </TabsContent>
                            <TabsContent value="fixative">
                                <FixativeRecommendationTool />
                            </TabsContent>
                            <TabsContent value="sensitivity">
                                <SensitivityAdjustmentTool />
                            </TabsContent>
                        </Tabs>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
