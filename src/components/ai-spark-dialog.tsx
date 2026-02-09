"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { generateFormulaSpark, type FormulaSparkInput, type FormulaSparkOutput } from "@/ai/flows/formula-spark-generation"

const formSchema = z.object({
  olfactoryProfile: z.string().min(2, {
    message: "Olfactory profile is required.",
  }),
  complexity: z.enum(["simple", "moderate", "complex"]),
  inspiration: z.string().optional(),
})

interface AiSparkDialogProps {
  children: React.ReactNode;
  onNewFormula: (formula: Record<string, number>, notes: string) => void;
}

export function AiSparkDialog({ children, onNewFormula }: AiSparkDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [result, setResult] = React.useState<FormulaSparkOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      olfactoryProfile: "floral",
      complexity: "moderate",
      inspiration: "A walk in a blooming garden after the rain",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    try {
      const aiResult = await generateFormulaSpark(values as FormulaSparkInput);
      setResult(aiResult);
    } catch (error) {
      console.error("AI Spark Error:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyFormula = () => {
    if (result) {
      onNewFormula(result.formula, result.notes);
      setOpen(false);
      setResult(null);
      form.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) {
        setResult(null);
        setIsLoading(false);
        form.reset();
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Sparkles className="text-primary" /> AI Formula Spark
          </DialogTitle>
          <DialogDescription>
            Generate a chemically-informed starting formula to inspire your next creation.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Forging new ideas...</p>
          </div>
        ) : result ? (
          <div className="space-y-4 py-4">
              <h3 className="font-semibold">Generated Formula:</h3>
              <div className="max-h-40 overflow-y-auto rounded-md border bg-muted/50 p-3 text-sm">
                <ul>
                  {Object.entries(result.formula).map(([name, amount]) => (
                    <li key={name} className="flex justify-between">
                      <span>{name}</span>
                      <span>{amount}g</span>
                    </li>
                  ))}
                </ul>
              </div>
              <h3 className="font-semibold">AI Notes:</h3>
              <p className="rounded-md border bg-muted/50 p-3 text-sm">{result.notes}</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="olfactoryProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Olfactory Profile</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Floral, Woody, Oriental" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="complex">Complex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="inspiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inspiration (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., A specific perfume, a feeling, a place" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                  <Button type="submit">Generate</Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        
        {result && !isLoading && (
            <DialogFooter>
                 <Button variant="outline" onClick={() => {
                     setResult(null);
                     setIsLoading(false);
                 }}>Generate Again</Button>
                <Button onClick={handleApplyFormula}>Apply to Formula</Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
