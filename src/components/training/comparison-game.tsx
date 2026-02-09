"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { dummyIngredients } from '@/lib/data' // Using dummy data for pool

export function ComparisonGame() {
    const [round, setRound] = React.useState(1)
    const [score, setScore] = React.useState(0)
    const [streak, setStreak] = React.useState(0)

    const [leftIng, setLeftIng] = React.useState(dummyIngredients[0])
    const [rightIng, setRightIng] = React.useState(dummyIngredients[1])

    const [sliderValue, setSliderValue] = React.useState([50])
    const [isSubmitted, setIsSubmitted] = React.useState(false)
    const [feedback, setFeedback] = React.useState<'correct' | 'close' | 'wrong' | null>(null)

    // Mock strength values (0-10) - hardcoded for demo since it's not in DB
    // Real app would fetch this from chemical properties
    const getStrength = (name: string) => {
        const len = name.length
        return (len % 10) + 1 // Deterministic mock strength
    }

    const startNewRound = () => {
        const i1 = Math.floor(Math.random() * dummyIngredients.length)
        let i2 = Math.floor(Math.random() * dummyIngredients.length)
        while (i1 === i2) i2 = Math.floor(Math.random() * dummyIngredients.length)

        setLeftIng(dummyIngredients[i1])
        setRightIng(dummyIngredients[i2])
        setSliderValue([50])
        setIsSubmitted(false)
        setFeedback(null)
        setRound(prev => prev + 1)
    }

    const checkAnswer = () => {
        const s1 = getStrength(leftIng.name)
        const s2 = getStrength(rightIng.name)

        // Correct ratio: if s1=10 and s2=5, s1 is 2x stronger.
        // To balance, we need less of s1. 
        // Slider 0-100. 50 is 1:1. 
        // Logic: Target slider value represents the balance point.
        // If Left is stronger, slider should be towards Left (lower value) to indicate "Less volume needed"?
        // Or simpler: "Which is stronger?"

        // Let's do: "Adjust slider to represent the strength ratio"
        // Center (50) = Equal. Left (0) = Left is much stronger. Right (100) = Right is much stronger.

        let target = 50
        if (s1 > s2) target = 50 - ((s1 - s2) * 5) // Move left
        if (s2 > s1) target = 50 + ((s2 - s1) * 5) // Move right

        target = Math.max(10, Math.min(90, target)) // Clamp

        const diff = Math.abs(sliderValue[0] - target)

        if (diff < 10) {
            setFeedback('correct')
            setScore(prev => prev + 100 + (streak * 10))
            setStreak(prev => prev + 1)
        } else if (diff < 25) {
            setFeedback('close')
            setScore(prev => prev + 50)
            setStreak(0)
        } else {
            setFeedback('wrong')
            setStreak(0)
        }

        setIsSubmitted(true)
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Trophy className="text-yellow-500" /> Olfactory Comparison
                    </CardTitle>
                    <div className="flex gap-4 text-sm font-medium">
                        <div>Score: <span className="text-primary text-lg">{score}</span></div>
                        <div>Streak: <span className="text-orange-500 text-lg">🔥 {streak}</span></div>
                    </div>
                </div>
                <CardDescription>Train your nose! Adjust the slider to estimate the relative odor strength between these two materials.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-10 py-8">
                <div className="flex justify-between items-center px-4">
                    <div className="text-center w-1/3">
                        <div className="text-4xl mb-2">🍋</div>
                        <h3 className="font-bold text-lg">{leftIng.name}</h3>
                        <Badge variant="outline">{leftIng.olfactiveFamilies[0] || 'Unknown'}</Badge>
                    </div>

                    <div className="text-2xl font-bold text-muted-foreground">VS</div>

                    <div className="text-center w-1/3">
                        <div className="text-4xl mb-2">🌲</div>
                        <h3 className="font-bold text-lg">{rightIng.name}</h3>
                        <Badge variant="outline">{rightIng.olfactiveFamilies[0] || 'Unknown'}</Badge>
                    </div>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                        <span>← {leftIng.name} is stronger</span>
                        <span>Equal Strength</span>
                        <span>{rightIng.name} is stronger →</span>
                    </div>

                    <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        disabled={isSubmitted}
                        className="py-4"
                    />
                </div>

                {isSubmitted && (
                    <div className={`p-4 rounded-lg text-center animate-in fade-in zoom-in ${feedback === 'correct' ? 'bg-green-100 text-green-800' :
                            feedback === 'close' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        <div className="flex items-center justify-center gap-2 text-xl font-bold mb-1">
                            {feedback === 'correct' && <><CheckCircle2 /> Perfect Match!</>}
                            {feedback === 'close' && <><CheckCircle2 /> Close Enough!</>}
                            {feedback === 'wrong' && <><XCircle /> Missed it!</>}
                        </div>
                        <p>
                            {leftIng.name} (Strength {getStrength(leftIng.name)}) vs {rightIng.name} (Strength {getStrength(rightIng.name)})
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
                {!isSubmitted ? (
                    <Button size="lg" onClick={checkAnswer} className="w-full max-w-xs">
                        Submit Guess
                    </Button>
                ) : (
                    <Button size="lg" onClick={startNewRound} variant="secondary" className="w-full max-w-xs">
                        Next Round <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
