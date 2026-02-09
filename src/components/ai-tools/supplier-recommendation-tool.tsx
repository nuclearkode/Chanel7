"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Sparkles, DollarSign, Clock, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { recommendBestSupplier, type RecommendBestSupplierInput, type RecommendBestSupplierOutput } from "@/ai/flows/recommend-best-supplier"

const formSchema = z.object({
  materialName: z.string().min(2, { message: "Material name is required." }),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number." }),
  criteria: z.enum(["value", "speed", "combined"]),
})

export function SupplierRecommendationTool() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<RecommendBestSupplierOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialName: "Iso E Super",
      quantity: 500,
      criteria: "combined",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await recommendBestSupplier(values as RecommendBestSupplierInput);
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
            <Sparkles className="text-primary" /> Supplier Recommendation Engine
        </CardTitle>
        <CardDescription>
          Find the best supplier for a material based on value, delivery speed, or a combination of both.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="materialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Iso E Super" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (g)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="criteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Criteria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select criteria" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="value">Best Value</SelectItem>
                            <SelectItem value="speed">Fastest Speed</SelectItem>
                            <SelectItem value="combined">Best Combined</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Recommending...</> : 'Recommend Supplier'}
            </Button>
          </CardFooter>
        </form>
      </Form>
      
      {result && (
        <CardContent>
            <div className="rounded-lg border bg-green-50 dark:bg-green-950/20 p-6">
                <CardTitle className="text-lg mb-4 flex items-center gap-2 text-green-900 dark:text-green-200">
                    <CheckCircle /> AI Recommendation: {result.supplierName}
                </CardTitle>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <DollarSign className="text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Price</p>
                            <p className="font-semibold">${result.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Delivery</p>
                            <p className="font-semibold">{result.deliveryTime}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">Reasoning</h4>
                    <p className="text-sm text-muted-foreground mt-1">{result.reasoning}</p>
                </div>
            </div>
        </CardContent>
      )}
    </Card>
  )
}
