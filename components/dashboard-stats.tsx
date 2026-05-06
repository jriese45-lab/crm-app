import { TrendingUp, TrendingDown, Phone, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

const stats = [
  {
    label: "Call Today",
    value: "4",
    subtext: "pending calls",
    icon: Phone,
    trend: null,
  },
  {
    label: "Overdue",
    value: "2",
    subtext: "follow-ups",
    icon: AlertTriangle,
    trend: null,
    alert: true,
  },
  {
    label: "At Risk",
    value: "3",
    subtext: "deals",
    icon: AlertTriangle,
    trend: null,
    alert: true,
  },
  {
    label: "Won This Week",
    value: "$24.5k",
    subtext: "+18%",
    icon: DollarSign,
    trend: "up",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex items-center gap-3 rounded-lg border p-3 ${
            stat.alert ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"
          }`}
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            stat.alert ? "bg-destructive/10" : "bg-muted"
          }`}>
            <stat.icon className={`h-4 w-4 ${stat.alert ? "text-destructive" : "text-muted-foreground"}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tracking-tight">{stat.value}</span>
              {stat.trend ? (
                <span className="flex items-center text-xs text-accent">
                  <TrendingUp className="mr-0.5 h-3 w-3" />
                  {stat.subtext}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">{stat.subtext}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
