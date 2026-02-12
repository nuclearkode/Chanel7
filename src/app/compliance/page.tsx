"use client"
import { BannedMaterialTool } from "@/components/ai-tools/banned-material-tool"
import { ChemistryValidationTool } from "@/components/ai-tools/chemistry-validation-tool"
import { CompliantAlternativesTool } from "@/components/ai-tools/compliant-alternatives-tool"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompliancePage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <h1 className="text-3xl font-bold text-foreground font-headline mb-6">Compliance Tools</h1>
            <Tabs defaultValue="alternatives" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="alternatives">Compliant Alternatives</TabsTrigger>
                                <TabsTrigger value="banned">Banned Replacements</TabsTrigger>
                                <TabsTrigger value="validation">Chemistry Validation</TabsTrigger>
                            </TabsList>
                            <TabsContent value="alternatives">
                                <CompliantAlternativesTool />
                            </TabsContent>
                            <TabsContent value="banned">
                                <BannedMaterialTool />
                            </TabsContent>
                <TabsContent value="validation">
                    <ChemistryValidationTool />
                </TabsContent>
            </Tabs>
        </div>
    )
}
