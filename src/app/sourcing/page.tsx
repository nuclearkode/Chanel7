"use client"
import AppSidebar from "@/components/app-sidebar"
import { SupplierRecommendationTool } from "@/components/ai-tools/supplier-recommendation-tool"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function SourcingPage() {
    return (
        <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
                <AppSidebar />
                <SidebarInset>
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
                        <h1 className="text-3xl font-bold text-foreground font-headline mb-6">Sourcing Tools</h1>
                        <SupplierRecommendationTool />
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
