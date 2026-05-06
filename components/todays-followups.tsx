"use client"

import { Phone, Mail, Calendar, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const followups = [
  {
    id: 1,
    contact: "Sarah Chen",
    company: "TechVentures Inc",
    initials: "SC",
    type: "call",
    time: "9:00 AM",
    deal: "$28,500",
    overdue: false,
    completed: false,
  },
  {
    id: 2,
    contact: "Mike Johnson",
    company: "Global Solutions",
    initials: "MJ",
    type: "email",
    time: "Yesterday",
    deal: "$15,200",
    overdue: true,
    completed: false,
  },
  {
    id: 3,
    contact: "Emily Davis",
    company: "StartupXYZ",
    initials: "ED",
    type: "meeting",
    time: "2:00 PM",
    deal: "$42,000",
    overdue: false,
    completed: false,
  },
  {
    id: 4,
    contact: "Alex Thompson",
    company: "Enterprise Co",
    initials: "AT",
    type: "call",
    time: "4:30 PM",
    deal: "$8,750",
    overdue: false,
    completed: true,
  },
]

const typeIcons = { call: Phone, email: Mail, meeting: Calendar }
const typeLabels = { call: "Call", email: "Email", meeting: "Meet" }

export function TodaysFollowups() {
  const pending = followups.filter((f) => !f.completed).length
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{pending}</Badge>
        </div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-1">
          {followups.map((item) => {
            const Icon = typeIcons[item.type as keyof typeof typeIcons]
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50 ${item.completed ? "opacity-50" : ""}`}
              >
                <button className="shrink-0">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </button>
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-secondary text-[10px]">{item.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium ${item.completed ? "line-through" : ""}`}>
                      {item.contact}
                    </span>
                    {item.overdue && <AlertCircle className="h-3 w-3 text-destructive" />}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.company} &middot; {item.deal}
                  </p>
                </div>
                <span className={`shrink-0 text-xs ${item.overdue ? "text-destructive" : "text-muted-foreground"}`}>
                  {item.time}
                </span>
                <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs">
                  <Icon className="h-3 w-3" />
                  {typeLabels[item.type as keyof typeof typeLabels]}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
