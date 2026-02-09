import { LabNavigation } from "@/components/navigation/lab-navigation"
import { LabSubmenu } from "@/components/navigation/lab-submenu"

export default function LabsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <LabNavigation />
            <LabSubmenu />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
