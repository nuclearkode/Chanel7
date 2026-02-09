"use client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { allFormulas } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FlaskConical, PlusCircle } from "lucide-react"

export default function FormulasPage() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-foreground font-headline">Formulas</h1>
                <Button>
                  <PlusCircle className="mr-2"/>
                  New Formula
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFormulas.map((formula) => (
                <Link href={`/dashboard?formula=${formula.id}`} key={formula.id} className="block">
                  <Card className="hover:border-primary transition-colors h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-headline">
                        <FlaskConical className="text-primary"/> {formula.name}
                      </CardTitle>
                      <CardDescription>{formula.ingredients.length} ingredients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formula.ingredients.map(i => i.name).join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
