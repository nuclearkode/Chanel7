"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FlaskConical, Microscope, Beaker, Package, ShieldCheck, Settings, UserCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const labs = [
    {
        id: "research",
        label: "Research",
        href: "/research",
        icon: Microscope,
        color: "from-blue-500 to-cyan-500",
        description: "Learn & Discover"
    },
    {
        id: "creation",
        label: "Creation",
        href: "/creation",
        icon: Beaker,
        color: "from-violet-500 to-purple-500",
        description: "Formulate & Analyze"
    },
    {
        id: "sourcing",
        label: "Sourcing",
        href: "/sourcing",
        icon: Package,
        color: "from-amber-500 to-orange-500",
        description: "Materials & Inventory"
    },
    {
        id: "compliance",
        label: "Compliance",
        href: "/compliance",
        icon: ShieldCheck,
        color: "from-emerald-500 to-green-500",
        description: "Regulations & Export"
    },
]

export function LabNavigation() {
    const pathname = usePathname()

    const getActiveLab = () => {
        for (const lab of labs) {
            if (pathname.startsWith(lab.href)) return lab.id
        }
        return "research" // default
    }

    const activeLab = getActiveLab()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 md:px-6">
                {/* Branding */}
                <Link href="/" className="flex items-center gap-2 mr-8">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700">
                        <FlaskConical className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl font-headline hidden sm:inline-block">ScentForge</span>
                </Link>

                {/* Lab Tabs */}
                <nav className="flex items-center gap-1 flex-1">
                    {labs.map((lab) => {
                        const isActive = activeLab === lab.id
                        const Icon = lab.icon

                        return (
                            <Link
                                key={lab.id}
                                href={lab.href}
                                className={cn(
                                    "relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                    "hover:bg-muted/80",
                                    isActive && "bg-muted"
                                )}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-md transition-all",
                                    isActive
                                        ? `bg-gradient-to-br ${lab.color} text-white shadow-lg`
                                        : "bg-muted-foreground/10 text-muted-foreground"
                                )}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className={cn(
                                    "font-medium text-sm hidden md:inline-block",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {lab.label}
                                </span>

                                {/* Active indicator */}
                                {isActive && (
                                    <span className={cn(
                                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full",
                                        `bg-gradient-to-r ${lab.color}`
                                    )} />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Right side: Settings & Avatar */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/settings"
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Settings className="w-5 h-5 text-muted-foreground" />
                    </Link>

                    <div className="flex items-center gap-2 pl-3 border-l">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs">
                                JD
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium leading-none">Jane Doe</p>
                            <p className="text-xs text-muted-foreground">Perfumer</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export { labs }
