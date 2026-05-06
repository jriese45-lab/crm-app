"use client"

import { useState } from "react"
import { Send, Sparkles, User, BarChart3, Users, Lightbulb, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

const suggestions = [
  { icon: Users, text: "Who should I call today?" },
  { icon: BarChart3, text: "Which deals need attention?" },
  { icon: Lightbulb, text: "How can I improve my win rate?" },
  { icon: Calendar, text: "Summarize this week" },
]

const initialMessages = [
  { role: "user", content: "Who should I prioritize today?" },
  {
    role: "assistant",
    content: `Based on your pipeline, prioritize:

**1. Sarah Chen (TechVentures) - HIGH**
Opened proposal 5x in the last hour. Deal: $28,500. Call her now.

**2. Emily Davis (StartupXYZ) - MEDIUM**
21 days in negotiation (avg: 14). Meeting at 2 PM. May need nudge on contract.

**3. Mike Johnson (Global Solutions)**
Expects pricing follow-up. Usually responsive 10-11 AM.

Want me to draft talking points?`,
  },
]

export function AIChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  const send = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "assistant", content: "Analyzing your CRM data... (Demo response - would connect to AI backend in production)" },
    ])
    setInput("")
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                <Sparkles className="h-5 w-5 text-background" />
              </div>
              <h2 className="mt-3 text-lg font-semibold">AI Sales Assistant</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ask about your pipeline, contacts, or next actions</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s.text)}
                    className="flex items-center gap-2.5 rounded-md border border-border p-3 text-left text-sm hover:bg-muted/50 transition-colors"
                  >
                    <s.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                {m.role === "assistant" ? (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-background" />
                  </div>
                ) : (
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-secondary text-[10px]">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 pt-0.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    {m.role === "assistant" ? "AI" : "You"}
                  </p>
                  <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="mx-auto flex max-w-2xl gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pipeline, contacts, or next actions..."
            className="h-9 flex-1 text-sm"
          />
          <Button type="submit" size="icon" className="h-9 w-9">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
