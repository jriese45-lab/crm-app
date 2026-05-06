"use client"

import { ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const deals = [
  { name: "TechVentures Inc", value: "$28,500", stage: "Proposal", days: 5, risk: false },
  { name: "StartupXYZ", value: "$42,000", stage: "Negotiation", days: 21, risk: true },
  { name: "Global Solutions", value: "$15,200", stage: "Meeting", days: 3, risk: false },
  { name: "Enterprise Co", value: "$8,750", stage: "Proposal", days: 8, risk: false },
]

const stageColors: Record<string, string> = {
  Qualification: "bg-chart-1/10 text-chart-1",
  Meeting: "bg-chart-2/10 text-chart-2",
  Proposal: "bg-chart-3/10 text-chart-3",
  Negotiation: "bg-chart-4/10 text-chart-4",
}

export function PipelinePreview() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-sm font-medium">Pipeline</CardTitle>
          <span className="text-xs text-muted-foreground">$142,580 total</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="h-7 gap-1 px-2 text-xs text-muted-foreground">
          <Link href="/pipeline">
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-1">
          {deals.map((deal, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{deal.name}</span>
                  {deal.risk && <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" />}
                </div>
              </div>
              <Badge variant="secondary" className={`shrink-0 text-[10px] ${stageColors[deal.stage]}`}>
                {deal.stage}
              </Badge>
              <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">{deal.days}d</span>
              <span className="w-16 shrink-0 text-right text-sm font-medium">{deal.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
