"use client"

import { Phone, Mail, FileText, DollarSign, UserPlus, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    icon: DollarSign,
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    title: "Deal closed",
    meta: "Acme Corp - $24,500",
    time: "2m",
  },
  {
    icon: ArrowUpRight,
    iconBg: "bg-chart-2/10",
    iconColor: "text-chart-2",
    title: "Stage changed",
    meta: "Enterprise Co to Proposal",
    time: "1h",
  },
  {
    icon: Phone,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    title: "Call logged",
    meta: "Sarah Chen - 12 min",
    time: "2h",
  },
  {
    icon: Mail,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    title: "Email sent",
    meta: "Mike Johnson",
    time: "3h",
  },
  {
    icon: FileText,
    iconBg: "bg-chart-4/10",
    iconColor: "text-chart-4",
    title: "Proposal sent",
    meta: "StartupXYZ - Enterprise Plan",
    time: "5h",
  },
  {
    icon: UserPlus,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    title: "New lead",
    meta: "DataTech Solutions",
    time: "6h",
  },
]

export function RecentActivity() {
  return (
    <Card className="border-border bg-card h-full">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Activity</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="space-y-3">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconBg}`}>
                <item.icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.meta}</p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
