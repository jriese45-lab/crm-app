"use client"

import { Sparkles, Phone, AlertTriangle, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const insights = [
  {
    icon: Phone,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    label: "Call Now",
    title: "Sarah Chen",
    description: "Opened proposal 5x in last hour",
    nextStep: "Call before 11 AM",
    action: "Call",
    priority: "high",
  },
  {
    icon: AlertTriangle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    label: "At Risk",
    title: "StartupXYZ Deal",
    description: "21 days in negotiation (avg: 14)",
    nextStep: "Schedule check-in call today",
    action: "Review",
    priority: "high",
  },
  {
    icon: Clock,
    iconBg: "bg-warning/10",
    iconColor: "text-warning-foreground",
    label: "Overdue",
    title: "Mike Johnson",
    description: "Follow-up was due yesterday",
    nextStep: "Send follow-up email",
    action: "Email",
    priority: "medium",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    label: "Moved",
    title: "Enterprise Co",
    description: "Advanced to Proposal stage",
    nextStep: "Prepare pricing proposal",
    action: "View",
    priority: "low",
  },
]

export function AIAssistantPanel() {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
              <Sparkles className="h-3 w-3 text-background" />
            </div>
            <span className="text-sm font-medium">AI Priorities</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 gap-1 px-2 text-xs text-muted-foreground">
            <Link href="/assistant">
              Ask AI
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((item, i) => (
            <div
              key={i}
              className="flex flex-col rounded-md border border-border p-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-start gap-2.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p>
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <p className="text-[11px] text-muted-foreground">{item.nextStep}</p>
                <Button variant="ghost" size="sm" className="h-6 shrink-0 px-2 text-xs">
                  {item.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
