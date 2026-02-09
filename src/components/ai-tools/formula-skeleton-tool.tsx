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
import { generateFormulaSkeleton, type FormulaSkeletonInput, type FormulaSkeletonOutput } from "@/ai/flows/formula-skeleton-generator"

const formSchema = z.object({
  constraints: z.string().min(10, { message: "Please provide some constraints." }),
})

export function FormulaSkeletonTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<FormulaSkeletonOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      constraints: "A woody and spicy scent with a hint of citrus. Avoid using any animalic notes.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await generateFormulaSkeleton(values as FormulaSkeletonInput);
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
            <Sparkles className="text-primary" /> Formula Skeleton Generator
        </CardTitle>
        <CardDescription>
          Provide constraints and let the AI generate a base formula structure for you to build upon, including chemical names and amounts in grams.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="constraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formula Constraints</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., A woody and spicy scent, avoid animalic notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Generating...</> : 'Generate Skeleton'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-2">
            <h3 className="font-semibold">AI Generated Formula Skeleton:</h3>
            <div className="rounded-md border bg-muted/50 p-4 whitespace-pre-wrap font-mono text-sm">
                {result.formula}
            </div>
        </CardContent>
      )}
    </Card>
  )
}
