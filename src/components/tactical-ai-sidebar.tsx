"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bot, Sparkles, Send, Share2, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { tacticalAIChat } from "@/ai/flows/tactical-ai-chat"

interface Message {
  id: string
  role: "user" | "ai"
  content: React.ReactNode
}

const SuggestedPairings = () => (
  <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden mt-2">
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
)

export function TacticalAISidebar() {
  const pathname = usePathname()
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "init-1",
      role: "ai",
      content: (
        <>
          I&apos;ve noticed you&apos;re looking at <span className="text-primary font-medium">Stemone</span>. Would you like me to find high-impact pairings for a green accord?
        </>
      ),
    },
    {
      id: "init-2",
      role: "ai",
      content: <SuggestedPairings />,
    },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessageText = inputValue.trim()
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageText,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const history = messages
        .map((m) => {
          if (typeof m.content === "string") {
            return { role: m.role, content: m.content }
          }
          // Convert the initial react-node message to string for AI context
          if (m.id === "init-1") {
            return {
              role: "ai",
              content: "I have noticed you are looking at Stemone. Would you like me to find high-impact pairings for a green accord?"
            }
          }
          return null
        })
        .filter((m): m is { role: "user" | "ai"; content: string } => m !== null)

      const result = await tacticalAIChat({
        history,
        message: userMessageText,
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: result.response,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I apologize, but I'm having trouble connecting right now. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (pathname.startsWith('/collaboration')) {
    return null
  }

  return (
    <div style={{ "--sidebar-width": "20rem" } as React.CSSProperties} className="contents">
      <Sidebar className="border-r border-border bg-sidebar top-16 !h-[calc(100svh-4rem)]">
        <SidebarHeader className="p-4 border-b border-border bg-sidebar-accent/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              Tactical AI
            </h2>
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <p className="text-xs text-muted-foreground/80">
            {isLoading ? "Thinking..." : "Analyzing current selection context..."}
          </p>
        </SidebarHeader>

        <SidebarContent className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-lg p-3 text-sm border",
                message.role === "ai"
                  ? "bg-secondary/50 border-border"
                  : "bg-primary/10 border-primary/20 ml-4"
              )}
            >
              <div className="flex items-start gap-3">
                {message.role === "ai" ? (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
                <div className="space-y-1 w-full overflow-hidden">
                  <div className="text-foreground break-words">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border bg-sidebar">
          <div className="relative">
            <Input
              className="w-full bg-secondary/50 border-none rounded-md py-2 pl-3 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary placeholder:text-muted-foreground"
              placeholder="Ask AI..."
              type="text"
              aria-label="Ask AI"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1.5 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
