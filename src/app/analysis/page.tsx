"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Copy, Download, Edit } from "lucide-react"
import { FragranceRadar } from "@/components/analysis/fragrance-radar"
import { ScentTimeline } from "@/components/analysis/scent-timeline"
import { IFRAComplianceTable } from "@/components/analysis/ifra-table"
import { usePerfume } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function AnalysisPage() {
  const { state } = usePerfume()
  const { activeFormula } = state
  const router = useRouter()

  const items = activeFormula.items || []
  const createdDate = activeFormula.createdAt ? new Date(activeFormula.createdAt).toLocaleDateString() : "Unknown"
  const updatedTime = activeFormula.updatedAt ? new Date(activeFormula.updatedAt).toLocaleTimeString() : "Unknown"

  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold font-display text-foreground">{activeFormula.name}</h1>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">DRAFT</span>
                </div>
                <p className="text-muted-foreground text-sm">Created on {createdDate} • Last modified {updatedTime}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Copy className="w-4 h-4" /> Duplicate
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" /> Export Report
                </Button>
                <Button onClick={() => router.push('/lab')} className="gap-2 shadow-lg shadow-primary/20">
                  <Edit className="w-4 h-4" /> Edit Formula
                </Button>
              </div>
            </header>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fragrance Fingerprint Card */}
              <div className="lg:col-span-1 h-full">
                <FragranceRadar items={items} />
              </div>

              {/* Scent Timeline */}
              <div className="lg:col-span-2 h-full">
                <ScentTimeline items={items} />
              </div>
            </div>

      {/* IFRA Compliance Section */}
      <section className="mt-6 pb-20">
        <IFRAComplianceTable items={items} />
      </section>
    </div>
  )
}
