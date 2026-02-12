import re

file_path = 'src/components/visual-lab/inspector.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Define the start and end of the block to replace
start_marker = "// --- Multi-Select / AI Insight Mode ---"
end_marker = "// --- Single Node Mode ---"

# New content to insert
new_block = """  // --- Multi-Select / AI Insight Mode ---
  if (selectionData.type === 'multi' && selectionData.nodes) {
      const nodes = selectionData.nodes

      return (
        <aside className="w-96 bg-zinc-950 border-l border-slate-800 flex flex-col z-30 shadow-xl h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-slate-800 bg-gradient-to-b from-purple-500/10 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-light text-white tracking-tight">AI Insight</h2>
                </div>
                <p className="text-sm text-slate-400 font-light">Analyzing interaction between {nodes.length} selected components.</p>
            </div>

            <div className="p-6 space-y-6">
                <AiAnalysisPanel key={nodes.map(n => n.id).join(',')} nodes={nodes} />

                <div>
                    <h3 className="text-xs font-mono uppercase text-slate-500 mb-3">Selected Components</h3>
                    <div className="space-y-2">
                        {nodes.map(n => (
                            <div key={n.id} className="flex items-center justify-between p-2 bg-zinc-900 rounded border border-slate-800">
                                <span className="text-sm text-slate-300">{n.data.label}</span>
                                <span className="text-xs font-mono text-slate-500">{n.data.concentration}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
      )
  }

"""

# Use regex to replace the block
pattern = re.escape(start_marker) + r".*?" + re.escape(end_marker)
# We need to be careful with greedy matching. The block is quite large.
# Let's try to match from start_marker to end_marker directly.

# Check if markers exist
if start_marker not in content or end_marker not in content:
    print("Markers not found!")
    exit(1)

# Find start index
start_idx = content.find(start_marker)
# Find end index
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find start or end index.")
    exit(1)

# Replace
new_content = content[:start_idx] + new_block + "  " + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(new_content)

print("Successfully updated inspector.tsx")
