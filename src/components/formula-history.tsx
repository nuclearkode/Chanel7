"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import { format } from "date-fns"
import { type HistoryEntry } from "@/lib/types"

interface FormulaHistoryProps {
  history?: HistoryEntry[]
}

export function FormulaHistory({ history }: FormulaHistoryProps) {
  // Sort by date desc (newest first)
  const sortedHistory = [...(history || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <History className="text-primary" /> Formula History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHistory.length > 0 ? (
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[160px]">Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(entry.date), "yyyy-MM-dd HH:mm")}
                    </TableCell>
                    <TableCell className="text-sm">{entry.user}</TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{entry.action}</div>
                      {entry.details && (
                        <div className="text-xs text-muted-foreground">{entry.details}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No history recorded yet.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
