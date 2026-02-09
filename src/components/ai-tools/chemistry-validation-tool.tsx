"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { chemistryConstraintValidation, type ChemistryConstraintValidationInput, type ChemistryConstraintValidationOutput } from "@/ai/flows/chemistry-constraint-validation"

const formSchema = z.object({
  materials: z.string().min(10, { message: "Please list at least two materials." }),
})

export function ChemistryValidationTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<ChemistryConstraintValidationOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materials: "Aldehyde C-12, Methyl Anthranilate, Indole",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const materialsArray = values.materials.split(',').map(m => m.trim()).filter(Boolean);
      const aiResult = await chemistryConstraintValidation({ materials: materialsArray });
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
            <Sparkles className="text-primary" /> Chemistry Constraint Validation
        </CardTitle>
        <CardDescription>
          Check for potential chemical incompatibilities between a list of fragrance materials to avoid Schiff bases or other reactions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="materials" render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Aldehyde C-12, Methyl Anthranilate, Indole" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Validating...</> : 'Validate Compatibility'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent>
            {result.compatible ? (
                 <div className="rounded-md border border-green-500 bg-green-50 p-4 dark:bg-green-950">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-green-800 dark:text-green-300">Compatible</h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">The selected materials appear to be chemically compatible.</p>
                 </div>
            ) : (
                <div className="rounded-md border border-destructive bg-destructive/10 p-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="text-destructive" />
                        <h3 className="font-semibold text-destructive">Potential Incompatibility</h3>
                    </div>
                     <ul className="list-disc pl-5 mt-2 space-y-1">
                        {result.warnings.map((warning, i) => (
                           <li key={i} className="text-sm text-destructive">{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
        </CardContent>
      )}
    </Card>
  )
}
