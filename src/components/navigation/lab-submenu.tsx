"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type SubMenuItem = {
    label: string
    href: string
}

type LabSubmenus = {
    [key: string]: SubMenuItem[]
}

const labSubmenus: LabSubmenus = {
    research: [
        { label: "Overview", href: "/research" },
        { label: "Training", href: "/research/training" },
        { label: "Library", href: "/research/library" },
        { label: "Ideas", href: "/research/ideas" },
    ],
    creation: [
        { label: "Editor", href: "/creation" },
        { label: "AI Assist", href: "/creation/ai-assist" },
        { label: "Templates", href: "/creation/templates" },
    ],
    sourcing: [
        { label: "Inventory", href: "/sourcing" },
        { label: "Suppliers", href: "/sourcing/suppliers" },
        { label: "Cost Analysis", href: "/sourcing/costs" },
    ],
    compliance: [
        { label: "IFRA Check", href: "/compliance" },
        { label: "Reports", href: "/compliance/reports" },
        { label: "Export", href: "/compliance/export" },
    ],
}

export function LabSubmenu() {
    const pathname = usePathname()

    const getActiveLab = (): string => {
        if (pathname.startsWith("/research")) return "research"
        if (pathname.startsWith("/creation")) return "creation"
        if (pathname.startsWith("/sourcing")) return "sourcing"
        if (pathname.startsWith("/compliance")) return "compliance"
        return "research"
    }

    const activeLab = getActiveLab()
    const items = labSubmenus[activeLab] || []

    return (
        <div className="border-b bg-muted/30">
            <div className="flex items-center gap-1 px-4 md:px-6 overflow-x-auto">
                {items.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== `/${activeLab}` && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                                "hover:text-foreground",
                                isActive
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export { labSubmenus }
