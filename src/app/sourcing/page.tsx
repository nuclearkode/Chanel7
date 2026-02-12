"use client"
import { SupplierRecommendationTool } from "@/components/ai-tools/supplier-recommendation-tool"

export default function SourcingPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <h1 className="text-3xl font-bold text-foreground font-headline mb-6">Sourcing Tools</h1>
            <SupplierRecommendationTool />
        </div>
    )
}
