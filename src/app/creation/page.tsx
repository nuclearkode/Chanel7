"use client"
import AppSidebar from "@/components/app-sidebar"
import { FormulaSkeletonTool } from "@/components/ai-tools/formula-skeleton-tool"
import { InteractiveCanvasTool } from "@/components/ai-tools/interactive-canvas-tool"
import { PersonalizedRecommendationsTool } from "@/components/ai-tools/personalized-recommendations-tool"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CreationPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset>
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                        <h1 className="text-3xl font-bold text-foreground font-headline mb-6">AI Creation Tools</h1>
                        <Tabs defaultValue="canvas" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="canvas">Interactive Canvas</TabsTrigger>
                                <TabsTrigger value="skeleton">Formula Skeleton</TabsTrigger>
                                <TabsTrigger value="recommendations">Personalized Recommendations</TabsTrigger>
                            </TabsList>
                            <TabsContent value="canvas">
                                <InteractiveCanvasTool />
                            </TabsContent>
                            <TabsContent value="skeleton">
                                <FormulaSkeletonTool />
                            </TabsContent>
                            <TabsContent value="recommendations">
                                <PersonalizedRecommendationsTool />
                            </TabsContent>
                        </Tabs>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
