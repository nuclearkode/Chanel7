"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { suggestCompliantAlternatives, type SuggestCompliantAlternativesInput, type SuggestCompliantAlternativesOutput } from "@/ai/flows/suggest-compliant-alternatives"
import { Badge } from "../ui/badge"

const formSchema = z.object({
  ingredientName: z.string().min(2, { message: "Ingredient name is required." }),
  ifraLimit: z.coerce.number().positive({ message: "IFRA limit must be positive." }),
  currentConcentration: z.coerce.number().positive({ message: "Current concentration must be positive." }),
  category: z.string().min(1, { message: "Category is required." }),
})

export function CompliantAlternativesTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<SuggestCompliantAlternativesOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredientName: "Rose Otto",
      ifraLimit: 1.25,
      currentConcentration: 2.5,
      category: "Fine Fragrance",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await suggestCompliantAlternatives(values as SuggestCompliantAlternativesInput);
      setResult(aiResult);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" /> Suggest Compliant Alternatives
        </CardTitle>
        <CardDescription>
          For an ingredient exceeding IFRA limits, get AI-powered suggestions for compliant alternatives that maintain the scent profile.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="ingredientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredient Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Rose Otto" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Fine Fragrance" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="currentConcentration" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Concentration (%)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="ifraLimit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFRA Limit (%)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Suggesting...</> : 'Suggest Alternatives'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-4">
            <h3 className="font-semibold">Suggested Alternatives:</h3>
            <div className="space-y-4">
            {result.alternatives.map((alt) => (
                <div key={alt.name} className="rounded-md border p-4">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{alt.name}</h4>
                        <Badge>Safe up to {alt.safeConcentration}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alt.reasoning}</p>
                </div>
            ))}
            </div>
        </CardContent>
      )}
    </Card>
  )
}
