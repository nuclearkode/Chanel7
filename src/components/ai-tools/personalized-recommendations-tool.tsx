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
import { getPersonalizedRecommendations, type PersonalizedRecommendationsInput, type PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations"

const formSchema = z.object({
  scentProfile: z.string().min(10, { message: "Please describe the scent profile." }),
  availableIngredients: z.string().min(10, { message: "Please list some available ingredients." }),
})

export function PersonalizedRecommendationsTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<PersonalizedRecommendationsOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scentProfile: "I love woody and earthy scents like Sandalwood and Vetiver. I dislike strong white florals like Tuberose. I'm neutral on citrus.",
      availableIngredients: "Bergamot, Lemon, Rose, Jasmine, Sandalwood, Vetiver, Patchouli, Cedarwood, Iso E Super, Ambroxan, Muscone",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await getPersonalizedRecommendations(values as PersonalizedRecommendationsInput);
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
            <Sparkles className="text-primary" /> Personalized Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered ingredient recommendations based on your personal scent profile and available materials.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="scentProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Scent Profile</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe ingredients you like, dislike, or are neutral about..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableIngredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Ingredients (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Bergamot, Sandalwood, Rose..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : 'Get Recommendations'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Recommended Ingredients:</h3>
              <p className="text-sm text-muted-foreground mt-1">{result.recommendations}</p>
            </div>
            <div>
              <h3 className="font-semibold">Reasoning:</h3>
              <p className="text-sm text-muted-foreground mt-1">{result.reasoning}</p>
            </div>
        </CardContent>
      )}
    </Card>
  )
}
