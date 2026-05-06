"use client"

import { MoreHorizontal, Plus, AlertTriangle, Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const stages = [
  {
    id: "qualification",
    name: "Qualification",
    color: "bg-chart-1",
    deals: [
      { id: 1, name: "TechVentures Inc", contact: "Sarah Chen", value: 28500, initials: "SC", days: 3, risk: false, probability: 30, nextStep: "Schedule discovery call", lastContact: "2h ago" },
      { id: 2, name: "DataTech Solutions", contact: "Lisa Wang", value: 35000, initials: "LW", days: 1, risk: false, probability: 25, nextStep: "Send intro materials", lastContact: "Just now" },
      { id: 3, name: "CloudFirst", contact: "James Miller", value: 12000, initials: "JM", days: 5, risk: false, probability: 20, nextStep: "Qualify budget", lastContact: "1d ago" },
    ],
  },
  {
    id: "meeting",
    name: "Meeting",
    color: "bg-chart-2",
    deals: [
      { id: 4, name: "Global Solutions", contact: "Mike Johnson", value: 15200, initials: "MJ", days: 7, risk: false, probability: 45, nextStep: "Demo scheduled Tue", lastContact: "5h ago" },
      { id: 5, name: "Innovate Labs", contact: "Rachel Green", value: 22000, initials: "RG", days: 2, risk: false, probability: 50, nextStep: "Send case studies", lastContact: "3h ago" },
    ],
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "bg-chart-3",
    deals: [
      { id: 6, name: "StartupXYZ", contact: "Emily Davis", value: 42000, initials: "ED", days: 4, risk: false, probability: 65, nextStep: "Review pricing call", lastContact: "4h ago" },
      { id: 7, name: "Enterprise Co", contact: "Alex Thompson", value: 8750, initials: "AT", days: 6, risk: false, probability: 70, nextStep: "Await feedback", lastContact: "1d ago" },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "bg-chart-4",
    deals: [
      { id: 8, name: "MegaCorp", contact: "David Wilson", value: 65000, initials: "DW", days: 21, risk: true, probability: 75, nextStep: "Address legal concerns", lastContact: "3d ago" },
    ],
  },
  {
    id: "closed",
    name: "Closed Won",
    color: "bg-accent",
    deals: [
      { id: 9, name: "Acme Corp", contact: "Jennifer Lee", value: 24500, initials: "JL", days: 0, risk: false, probability: 100, nextStep: "Onboarding", lastContact: "Today" },
    ],
  },
]

export function PipelineBoard() {
  const totalPipeline = stages.slice(0, -1).reduce((sum, stage) => {
    return sum + stage.deals.reduce((s, d) => s + d.value, 0)
  }, 0)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground">${totalPipeline.toLocaleString()} total value</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Deal
        </Button>
      </div>

      {/* Kanban Board - fills remaining space */}
      <div className="-mx-1 flex flex-1 gap-3 overflow-x-auto px-1 pb-2">
        {stages.map((stage) => {
          const stageTotal = stage.deals.reduce((s, d) => s + d.value, 0)
          return (
            <div key={stage.id} className="flex w-[200px] shrink-0 flex-col last:mr-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="text-sm font-medium">{stage.name}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{stage.deals.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">${stageTotal.toLocaleString()}</span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto">
                {stage.deals.map((deal) => (
                  <Card key={deal.id} className={`border-border bg-card group cursor-pointer transition-colors hover:border-muted-foreground/30 ${deal.risk ? "border-destructive/50" : ""}`}>
                    <CardContent className="p-2.5">
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-medium">{deal.name}</span>
                            {deal.risk && <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" />}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-[8px] bg-muted">{deal.initials}</AvatarFallback>
                            </Avatar>
                            <span className="truncate text-xs text-muted-foreground">{deal.contact}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
                          <p className="text-[10px] text-muted-foreground">{deal.probability}%</p>
                        </div>
                      </div>
                      {/* Next step */}
                      <p className="mt-2 truncate text-[11px] text-muted-foreground">{deal.nextStep}</p>
                      {/* Footer */}
                      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {deal.days === 0 ? "Today" : `${deal.days}d`}
                          </span>
                          <span className={deal.risk ? "text-destructive" : ""}>{deal.lastContact}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Move stage</DropdownMenuItem>
                            <DropdownMenuItem>Add note</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start gap-1.5 text-xs text-muted-foreground h-7">
                  <Plus className="h-3 w-3" />
                  Add deal
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
