"use client"
import AppSidebar from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { allFormulas } from "@/lib/data"
import { Ingredient } from "@/lib/types"

export default function InventoryPage() {
  const allIngredients = allFormulas.flatMap(f => f.ingredients);
  const uniqueIngredients = Array.from(new Map(allIngredients.map(item => [item.name, item])).values())
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <h1 className="text-3xl font-bold text-foreground font-headline mb-6">
              Material Inventory
            </h1>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Cost/g</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Olfactive Families</TableHead>
                    <TableHead>IFRA Limit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueIngredients.map((ingredient: Ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell className="font-medium">
                        {ingredient.name}
                      </TableCell>
                      <TableCell>{ingredient.vendor}</TableCell>
                      <TableCell>${ingredient.cost.toFixed(3)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ingredient.note}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {ingredient.olfactiveFamilies.map(family => (
                            <Badge key={family} variant="secondary">
                              {family}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <span>{ingredient.ifraLimit}%</span>
                           {ingredient.isAllergen && <Badge variant="destructive">Allergen</Badge>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
