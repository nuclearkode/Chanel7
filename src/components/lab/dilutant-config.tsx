"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DilutantConfigProps {
  solvent: string
  setSolvent: (solvent: string) => void
  solventWeight: number
  setSolventWeight: (weight: number) => void
  totalWeight: number
}

export function DilutantConfig({ solvent, setSolvent, solventWeight, setSolventWeight, totalWeight }: DilutantConfigProps) {
  return (
    <div className="bg-secondary/20 rounded-xl p-4 border border-border flex flex-wrap gap-6 items-end">
      <div className="flex-1 min-w-[200px]">
        <Label className="text-xs text-primary font-bold uppercase tracking-wide mb-2 block">Solvent Base</Label>
        <Select value={solvent} onValueChange={setSolvent}>
          <SelectTrigger className="w-full bg-background border-input text-foreground font-medium">
            <SelectValue placeholder="Select Solvent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sda40b">Perfumer's Alcohol (SDA 40B)</SelectItem>
            <SelectItem value="ipm">Isopropyl Myristate (IPM)</SelectItem>
            <SelectItem value="fco">Fractionated Coconut Oil</SelectItem>
            <SelectItem value="dpg">Dipropylene Glycol (DPG)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-32">
        <Label className="text-xs text-primary font-bold uppercase tracking-wide mb-2 block">Weight (g)</Label>
        <Input
          className="w-full bg-background border-input text-foreground font-mono text-right"
          type="number"
          step="0.01"
          value={solventWeight}
          onChange={(e) => setSolventWeight(parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="pb-2 text-xs text-muted-foreground font-medium">
        Targeting <span className="text-foreground font-bold font-mono">{totalWeight.toFixed(2)}g</span> Total Batch
      </div>
    </div>
  )
}
