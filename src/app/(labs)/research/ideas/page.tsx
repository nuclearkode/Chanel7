"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Trash2, Sparkles } from "lucide-react"
import React from "react"

type Idea = {
    id: string
    title: string
    description: string
    tags: string[]
    createdAt: Date
}

export default function IdeasPage() {
    const [ideas, setIdeas] = React.useState<Idea[]>([
        {
            id: "1",
            title: "Summer Citrus Blend",
            description: "Light bergamot top with neroli heart and white musk base. Perfect for hot weather.",
            tags: ["Citrus", "Fresh", "Summer"],
            createdAt: new Date()
        },
        {
            id: "2",
            title: "Smoky Rose Experiment",
            description: "Combine rose absolute with birch tar and labdanum for a mysterious evening scent.",
            tags: ["Floral", "Smoky", "Evening"],
            createdAt: new Date()
        }
    ])

    const [newIdea, setNewIdea] = React.useState({ title: "", description: "", tags: "" })

    const addIdea = () => {
        if (!newIdea.title) return
        setIdeas(prev => [...prev, {
            id: Date.now().toString(),
            title: newIdea.title,
            description: newIdea.description,
            tags: newIdea.tags.split(",").map(t => t.trim()).filter(Boolean),
            createdAt: new Date()
        }])
        setNewIdea({ title: "", description: "", tags: "" })
    }

    const deleteIdea = (id: string) => {
        setIdeas(prev => prev.filter(i => i.id !== id))
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                        <Lightbulb className="w-6 h-6" />
                    </span>
                    Ideas Board
                </h1>
                <p className="text-muted-foreground mt-1">Capture your fragrance inspirations</p>
            </div>

            {/* New Idea Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">New Idea</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Idea title..."
                        value={newIdea.title}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                        placeholder="Describe your idea... What notes? What mood? What occasion?"
                        value={newIdea.description}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Input
                        placeholder="Tags (comma separated): Floral, Summer, Fresh..."
                        value={newIdea.tags}
                        onChange={(e) => setNewIdea(prev => ({ ...prev, tags: e.target.value }))}
                    />
                    <Button onClick={addIdea}>
                        <Plus className="w-4 h-4 mr-2" /> Add Idea
                    </Button>
                </CardContent>
            </Card>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea) => (
                    <Card key={idea.id} className="group relative">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-headline">{idea.title}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => deleteIdea(idea.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                            <CardDescription className="text-xs">
                                {idea.createdAt.toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">{idea.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {idea.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                                <Sparkles className="w-3 h-3 mr-2" /> Create Formula
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {ideas.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No ideas yet. Start capturing your fragrance inspirations!</p>
                </div>
            )}
        </div>
    )
}
