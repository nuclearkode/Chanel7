"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

interface FormulaHeaderProps {
  formulaName: string
  setFormulaName: (name: string) => void
}

export function FormulaHeader({ formulaName, setFormulaName }: FormulaHeaderProps) {
  return (
    <div className="px-6 py-2 border-b border-border ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-0">
        <div className="flex-1 w-full">
          <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1 block">Formula Name</label>
          <Input
            className="w-full bg-transparent text-3xl font-bold text-foreground border-0 border-b-2 border-transparent hover:border-muted-foreground/50 focus:border-primary focus:ring-0 px-0 py-1 transition-colors placeholder-muted-foreground h-auto rounded-none shadow-none"
            placeholder="Untitled Formula"
            type="text"
            value={formulaName}
            onChange={(e) => setFormulaName(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="text-muted-foreground hover:bg-secondary">
            Export PDF
          </Button>
          <Button className="font-bold shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all">
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
