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
import { suggestReplacementMaterials, type ReplacementMaterialInput, type ReplacementMaterialOutput } from "@/ai/flows/banned-material-replacement-suggestions"

const formSchema = z.object({
  bannedMaterial: z.string().min(2, { message: "Material name is required." }),
  desiredScentProfile: z.string().min(2, { message: "Scent profile is required." }),
})

export function BannedMaterialTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<ReplacementMaterialOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bannedMaterial: "Oakmoss",
      desiredScentProfile: "Earthy, woody, mossy",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await suggestReplacementMaterials(values as ReplacementMaterialInput);
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
            <Sparkles className="text-primary" /> Banned Material Replacements
        </CardTitle>
        <CardDescription>
          Find suitable, compliant replacements for banned or restricted fragrance materials while maintaining your desired scent profile.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="bannedMaterial" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banned Material</FormLabel>
                    <FormControl><Input placeholder="e.g., Oakmoss" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="desiredScentProfile" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Scent Profile</FormLabel>
                    <FormControl><Input placeholder="e.g., Earthy, woody" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Searching...</> : 'Find Replacements'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Suggested Replacements:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.suggestedReplacements.map((rep) => (
                <div key={rep} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm">{rep}</div>
              ))}
            </div>
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
