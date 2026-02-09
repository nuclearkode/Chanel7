"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Star, Plus } from 'lucide-react'
import { type Evaluation, type Formula } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export function EvaluationTimeline({ formula, onAddEvaluation }: { formula: Formula, onAddEvaluation: (data: Omit<Evaluation, 'id'>) => void }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [newEval, setNewEval] = React.useState<Partial<Evaluation>>({
        dayOffset: 0,
        rating: 5,
        notes: '',
        longevity: 0
    })

    // Sort evaluations by dayOffset
    const evaluations = [...(formula.evaluations || [])].sort((a, b) => a.dayOffset - b.dayOffset)

    const handleSubmit = () => {
        if (!newEval.notes) return
        onAddEvaluation({
            date: new Date().toISOString(),
            dayOffset: newEval.dayOffset || 0,
            rating: newEval.rating || 5,
            notes: newEval.notes || '',
            longevity: newEval.longevity
        })
        setIsOpen(false)
        setNewEval({ dayOffset: 0, rating: 5, notes: '', longevity: 0 })
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                        <Calendar className="text-primary" /> Maturation Log
                    </CardTitle>
                    <CardDescription>Track scent evolution over time</CardDescription>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Log</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log Evaluation</DialogTitle>
                            <DialogDescription>Record your observations for this formula.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Stage</Label>
                                <Select
                                    value={newEval.dayOffset?.toString()}
                                    onValueChange={(v) => setNewEval({ ...newEval, dayOffset: parseInt(v) })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Day 0 (Fresh)</SelectItem>
                                        <SelectItem value="3">Day 3</SelectItem>
                                        <SelectItem value="7">Day 7</SelectItem>
                                        <SelectItem value="14">Day 14</SelectItem>
                                        <SelectItem value="28">Day 28</SelectItem>
                                        <SelectItem value="42">Day 42 (Matured)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Rating</Label>
                                <Input
                                    type="number"
                                    min="1" max="10"
                                    value={newEval.rating}
                                    onChange={(e) => setNewEval({ ...newEval, rating: parseInt(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Longevity (hrs)</Label>
                                <Input
                                    type="number"
                                    value={newEval.longevity}
                                    onChange={(e) => setNewEval({ ...newEval, longevity: parseFloat(e.target.value) })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Notes</Label>
                                <Textarea
                                    value={newEval.notes}
                                    onChange={(e) => setNewEval({ ...newEval, notes: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit}>Save Log</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="relative pl-6 border-l ml-6 space-y-8">
                {evaluations.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No evaluations logged yet.</p>
                )}
                {evaluations.map((ev) => (
                    <div key={ev.id} className="relative">
                        <span className="absolute -left-[33px] flex h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">Day {ev.dayOffset}</span>
                                <span className="text-xs text-muted-foreground">{new Date(ev.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500 text-xs">
                                {Array.from({ length: Math.min(5, Math.ceil(ev.rating / 2)) }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                <span className="text-foreground font-medium ml-1">{ev.rating}/10</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 bg-muted/40 p-2 rounded">
                                {ev.notes}
                            </p>
                            {ev.longevity && (
                                <span className="text-xs font-mono text-primary bg-primary/10 w-fit px-1 rounded">
                                    Longevity: {ev.longevity}h
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
