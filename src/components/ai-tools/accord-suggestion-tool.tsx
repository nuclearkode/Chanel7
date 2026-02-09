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
import { suggestAccord, type AccordSuggestionInput, type AccordSuggestionOutput } from "@/ai/flows/accord-suggestion-engine"

const formSchema = z.object({
  component1: z.string().min(2, { message: "Component name is required." }),
  component2: z.string().min(2, { message: "Component name is required." }),
})

export function AccordSuggestionTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<AccordSuggestionOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      component1: "Bergamot",
      component2: "Sandalwood",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await suggestAccord(values as AccordSuggestionInput);
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
            <Sparkles className="text-primary" /> Accord Suggestion Engine
        </CardTitle>
        <CardDescription>
          Get creative, AI-generated suggestions for an accord (a "bridge") to harmoniously connect two different fragrance components.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="component1" render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Component</FormLabel>
                    <FormControl><Input placeholder="e.g., Bergamot" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="component2" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Component</FormLabel>
                    <FormControl><Input placeholder="e.g., Sandalwood" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Thinking...</> : 'Suggest Accord'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-2">
            <h3 className="font-semibold">AI Accord Suggestion:</h3>
            <div className="rounded-md border bg-muted/50 p-4">
                <p className="text-sm">{result.accordSuggestion}</p>
            </div>
        </CardContent>
      )}
    </Card>
  )
}
