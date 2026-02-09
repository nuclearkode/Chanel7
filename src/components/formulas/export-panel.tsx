"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileJson, FileText, QrCode, Share2 } from 'lucide-react'
import { type Formula } from '@/lib/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface ExportPanelProps {
    formula: Formula
}

export function ExportPanel({ formula }: ExportPanelProps) {
    const { toast } = useToast()
    const [qrOpen, setQrOpen] = React.useState(false)

    const exportAsJSON = () => {
        const dataStr = JSON.stringify(formula, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formula.name.replace(/\s+/g, '_')}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported!", description: "Formula saved as JSON." })
    }

    const exportAsCSV = () => {
        const headers = ['Name', 'Concentration', 'Note', 'Vendor', 'Cost/g', 'IFRA Limit', 'Allergen']
        const rows = formula.ingredients.map(ing => [
            ing.name,
            ing.concentration,
            ing.note,
            ing.vendor,
            ing.cost,
            ing.ifraLimit,
            ing.isAllergen ? 'Yes' : 'No'
        ])

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formula.name.replace(/\s+/g, '_')}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported!", description: "Formula saved as CSV." })
    }

    const exportAsText = () => {
        let content = `FORMULA: ${formula.name}\n`
        content += `${'='.repeat(40)}\n\n`
        content += `INGREDIENTS:\n`
        formula.ingredients.forEach(ing => {
            content += `  - ${ing.name}: ${ing.concentration}% (${ing.note})\n`
            content += `    Vendor: ${ing.vendor} | Cost: $${ing.cost}/g | IFRA: ${ing.ifraLimit}%\n`
        })
        content += `\nTotal Concentration: ${formula.ingredients.reduce((a, i) => a + i.concentration, 0).toFixed(2)}%\n`

        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formula.name.replace(/\s+/g, '_')}.txt`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported!", description: "Formula saved as text." })
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(formula, null, 2))
            toast({ title: "Copied!", description: "Formula JSON copied to clipboard." })
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to copy." })
        }
    }

    // Generate a simple QR code URL using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ name: formula.name, id: formula.id }))}`

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" /> Export & Share
                </CardTitle>
                <CardDescription>Download or share your formula</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" /> Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={exportAsJSON}>
                            <FileJson className="w-4 h-4 mr-2" /> JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportAsCSV}>
                            <FileText className="w-4 h-4 mr-2" /> CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={exportAsText}>
                            <FileText className="w-4 h-4 mr-2" /> Plain Text
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    Copy JSON
                </Button>

                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <QrCode className="w-4 h-4 mr-2" /> QR Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs text-center">
                        <DialogHeader>
                            <DialogTitle>Share via QR</DialogTitle>
                            <DialogDescription>Scan to access formula info</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            <img src={qrCodeUrl} alt="QR Code" className="rounded-lg shadow-md" />
                        </div>
                        <p className="text-xs text-muted-foreground">{formula.name}</p>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
