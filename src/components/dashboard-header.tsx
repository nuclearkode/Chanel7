import React from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { AiSparkDialog } from './ai-spark-dialog'

interface DashboardHeaderProps {
  formulaName: string;
  onNewFormula: (formula: Record<string, number>, notes: string) => void;
}

export function DashboardHeader({ formulaName, onNewFormula }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-foreground font-headline">
        {formulaName}
      </h1>
      <AiSparkDialog onNewFormula={onNewFormula}>
        <Button>
          <Sparkles className="mr-2" />
          AI Spark
        </Button>
      </AiSparkDialog>
    </div>
  )
}
