"use client"

import * as React from "react"
import { Loader2, Sparkles, PlusCircle, Trash2 } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { dynamicSensitivityAdjustments, type DynamicSensitivityAdjustmentsInput, type DynamicSensitivityAdjustmentsOutput } from "@/ai/flows/dynamic-sensitivity-adjustments"
import { allFormulas } from "@/lib/data"

const comparisonSchema = z.object({
  material1: z.string().min(1),
  material2: z.string().min(1),
  ratio: z.string().min(1),
  userPreference: z.string().min(1),
})

const formSchema = z.object({
    comparisonGameData: z.array(comparisonSchema)
})

const initialProfile = {
    Citrus: 5,
    Floral: 5,
    Woody: 5,
    Spicy: 5,
    Fruity: 5,
    Earthy: 5,
    Amber: 5,
    Animalic: 5,
    Green: 5,
    Aquatic: 5,
    Gourmand: 5,
    Musky: 5
}

export function SensitivityAdjustmentTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<DynamicSensitivityAdjustmentsOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comparisonGameData: [
        { material1: 'Bergamot', material2: 'Lemon', ratio: '1:1', userPreference: 'Bergamot' },
        { material1: 'Rose', material2: 'Jasmine', ratio: '2:1', userPreference: 'Jasmine' },
      ]
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "comparisonGameData"
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const input: DynamicSensitivityAdjustmentsInput = {
        ...values,
        userScentProfile: initialProfile
      }
      const aiResult = await dynamicSensitivityAdjustments(input);
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
            <Sparkles className="text-primary" /> Sensitivity Profile Adjustment
        </CardTitle>
        <CardDescription>
          Input data from the "Comparison Game" to let an AI dynamically adjust and personalize a user's scent sensitivity profile.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
                <FormLabel>Comparison Game Data</FormLabel>
                <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 items-end">
                            <FormField control={form.control} name={`comparisonGameData.${index}.material1`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Material 1" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`comparisonGameData.${index}.material2`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Material 2" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`comparisonGameData.${index}.ratio`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Ratio" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name={`comparisonGameData.${index}.userPreference`} render={({ field }) => (<FormItem><FormControl><Input placeholder="Preference" {...field} /></FormControl></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="text-muted-foreground"/></Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({material1: '', material2: '', ratio: '', userPreference: ''})}>
                    <PlusCircle className="mr-2" /> Add Comparison
                </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : 'Adjust Profile'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent className="space-y-2">
            <h3 className="font-semibold">Adjusted Sensitivity Profile:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(result).map(([family, value]) => (
                    <div key={family} className="rounded-md border p-3">
                        <div className="font-medium">{family}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value * 10}%` }}></div>
                            </div>
                            <span className="text-sm font-bold w-8">{value.toFixed(1)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      )}
    </Card>
  )
}
