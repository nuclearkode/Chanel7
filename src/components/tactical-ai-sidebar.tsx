"use client"

import * as React from "react"
import { Bot, Sparkles, AlertTriangle, Send, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function TacticalAISidebar() {
  return (
    <div style={{ "--sidebar-width": "20rem" } as React.CSSProperties} className="contents">
      <Sidebar className="border-r border-border bg-sidebar">
        <SidebarHeader className="p-4 border-b border-border bg-sidebar-accent/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Tactical AI
            </h2>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-muted-foreground/80">Analyzing current selection context...</p>
        </SidebarHeader>

        <SidebarContent className="p-4 space-y-4">
          {/* Chat Message */}
          <div className="bg-secondary/50 rounded-lg p-3 text-sm border border-border">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-foreground">
                  I&apos;ve noticed you&apos;re looking at <span className="text-primary font-medium">Stemone</span>. Would you like me to find high-impact pairings for a green accord?
                </p>
              </div>
            </div>
          </div>

          {/* Suggested Pairings */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-border bg-secondary/30 flex justify-between items-center">
              <span className="text-xs font-semibold text-muted-foreground">SUGGESTED PAIRINGS</span>
              <Share2 className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="p-3 space-y-2">
              {[
                { name: "Triplal", color: "bg-green-400", match: "92%" },
                { name: "Galbanum EO", color: "bg-yellow-400", match: "85%" },
                { name: "Violet Leaf Abs", color: "bg-purple-400", match: "78%" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between group cursor-pointer hover:bg-secondary/50 p-1 rounded transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", item.color)}></span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{item.match}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Warning */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden border-l-4 border-l-red-500">
            <div className="px-3 py-2 border-b border-border bg-secondary/30 flex justify-between items-center">
              <span className="text-xs font-semibold text-red-500">COMPLIANCE WARNING</span>
              <AlertTriangle className="w-3 h-3 text-red-500" />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recent IFRA amendment (51st) affects usage limits for associated green notes in Category 4. Verify total formula load.
              </p>
              <Button variant="link" className="mt-2 text-xs text-primary h-auto p-0 flex items-center gap-1">
                Run Check <span className="text-[10px]">→</span>
              </Button>
            </div>
          </div>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border bg-sidebar">
          <div className="relative">
            <Input
              className="w-full bg-secondary/50 border-none rounded-md py-2 pl-3 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
              placeholder="Ask AI..."
              type="text"
              aria-label="Ask AI"
            />
            <button className="absolute right-2 top-1.5 text-muted-foreground hover:text-primary transition-colors">
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
