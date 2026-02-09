"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Upload, Sparkles, Beaker } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
    onNewFormula: () => void
}

export function QuickActions({ onNewFormula }: QuickActionsProps) {
    return (
        <div className="flex gap-2 mb-6">
            <Button onClick={onNewFormula} className="bg-primary hover:bg-primary/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Formula
            </Button>
            <Link href="/creation">
                <Button variant="secondary" className="bg-accent/20 hover:bg-accent/30 text-accent-foreground border-accent/20">
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    AI Spark
                </Button>
            </Link>
            <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import JSON
            </Button>
            <Button variant="outline">
                <Beaker className="mr-2 h-4 w-4" />
                Dilution Tool
            </Button>
        </div>
    )
}
