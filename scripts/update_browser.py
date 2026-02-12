import sys

filepath = "src/components/ingredient-browser.tsx"
with open(filepath, "r") as f:
    content = f.read()

# Add Header
if "Conc. <ArrowUpDown" not in content:
    search_str = "<TableHead className=\"text-right cursor-pointer hover:bg-muted\" onClick={() => handleSort('longevity')}>"
    insert_str = """                  <TableHead className="text-right cursor-pointer hover:bg-muted" onClick={() => handleSort('concentration')}>
                    <div className="flex items-center justify-end gap-1">Conc. <ArrowUpDown className="h-3 w-3" /></div>
                  </TableHead>
"""
    content = content.replace(search_str, insert_str + search_str)

# Add Cell
if "{ing.concentration}%" not in content:
    search_cell = "<TableCell className=\"text-right font-mono text-xs\">{ing.longevity}</TableCell>"
    insert_cell = """                      <TableCell className="text-right font-mono text-xs">
                        {ing.concentration}%
                      </TableCell>
"""
    content = content.replace(search_cell, insert_cell + search_cell)

with open(filepath, "w") as f:
    f.write(content)
