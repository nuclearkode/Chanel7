"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { suggestFixative, type SuggestFixativeInput, type SuggestFixativeOutput } from "@/ai/flows/fixative-recommendation-for-longevity"

const formSchema = z.object({
  scentProfile: z.string().min(10, { message: "Please describe the scent profile." }),
  desiredLongevity: z.enum(["short", "moderate", "long-lasting"]),
})

export function FixativeRecommendationTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<SuggestFixativeOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scentProfile: "A light, airy floral with top notes of citrus and a hint of green tea.",
      desiredLongevity: "long-lasting",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await suggestFixative(values as SuggestFixativeInput);
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
            <Sparkles className="text-primary" /> Fixative Recommendation
        </CardTitle>
        <CardDescription>
          Based on your scent's profile and desired longevity, get an AI-powered recommendation for a fixative to extend its life.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
              <FormField control={form.control} name="scentProfile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scent Profile</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the top, middle, and base notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="desiredLongevity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Longevity</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select desired longevity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="short">Short (1-3 hours)</SelectItem>
                        <SelectItem value="moderate">Moderate (4-6 hours)</SelectItem>
                        <SelectItem value="long-lasting">Long-lasting (7+ hours)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Recommending...</> : 'Recommend Fixative'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-2">
            <h3 className="font-semibold">AI Fixative Suggestion:</h3>
            <div className="rounded-md border bg-muted/50 p-4">
                <p className="text-sm">{result.fixativeSuggestion}</p>
            </div>
        </CardContent>
      )}
    </Card>
  )
}
