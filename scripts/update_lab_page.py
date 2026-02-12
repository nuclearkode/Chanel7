import sys

filepath = "src/app/lab/page.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Add Imports
if "VisualEditor" not in content:
    imports = """import { ScentTimeline } from "@/components/analysis/scent-timeline"
import { VisualEditor } from "@/components/lab/visual-editor"
"""
    content = content.replace('import { type Ingredient } from "@/lib/types"', 'import { type Ingredient } from "@/lib/types"\n' + imports)

# Add Tabs Triggers
if 'value="analysis"' not in content:
    trigger_search = 'value="history"'
    trigger_insert = """                    <TabsTrigger
                      value="history"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      History & Changes
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="visual"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Visual Formula
                    </TabsTrigger>"""
    # Replace the history trigger block with the extended one (be careful with whitespace matching)
    # Actually, simpler to find the closing tag of History trigger and append

    # We will look for the specific block of History trigger to replace it properly
    start_marker = 'value="history"'
    end_marker = '>\n                      History & Changes\n                    </TabsTrigger>'

    # A bit risky with python string matching on formatted code.
    # Let's try to find the place after </TabsList> is probably too late.
    # Let's just find the closing of History trigger.

    find_str = 'History & Changes\n                    </TabsTrigger>'
    replace_str = """History & Changes
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Analysis
                    </TabsTrigger>
                    <TabsTrigger
                      value="visual"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-6"
                    >
                      Visual Formula
                    </TabsTrigger>"""
    content = content.replace(find_str, replace_str)

# Add Tabs Content
if 'value="analysis"' not in content: # Check again if content added
    # We need to add content blocks.
    # Find the end of history content
    content_find = '<FormulaHistory history={activeFormula.history} />\n                   </div>\n                </TabsContent>'

    content_add = """
                <TabsContent value="analysis" className="flex-1 p-6 mt-0 overflow-y-auto">
                   <div className="max-w-4xl mx-auto h-full">
                      <ScentTimeline items={items} />
                   </div>
                </TabsContent>

                <TabsContent value="visual" className="flex-1 p-0 mt-0 overflow-hidden h-full">
                   <VisualEditor ingredients={state.inventory} />
                </TabsContent>"""

    content = content.replace(content_find, content_find + content_add)

with open(filepath, "w") as f:
    f.write(content)
