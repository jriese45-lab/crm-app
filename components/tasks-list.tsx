"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Phone, Mail, Calendar, Clock, MoreHorizontal, Plus, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const tasks = [
  {
    id: 1,
    title: "Call Sarah Chen",
    description: "Discuss enterprise pricing",
    type: "call",
    priority: "high",
    time: "9:00 AM",
    contact: "Sarah Chen",
    company: "TechVentures",
    overdue: false,
    completed: false,
  },
  {
    id: 2,
    title: "Send proposal to Mike",
    description: "Custom integration pricing",
    type: "email",
    priority: "high",
    time: "Yesterday",
    contact: "Mike Johnson",
    company: "Global Solutions",
    overdue: true,
    completed: false,
  },
  {
    id: 3,
    title: "Demo call with Emily",
    description: "Product walkthrough",
    type: "meeting",
    priority: "medium",
    time: "2:00 PM",
    contact: "Emily Davis",
    company: "StartupXYZ",
    overdue: false,
    completed: false,
  },
  {
    id: 4,
    title: "Review MegaCorp contract",
    description: "Legal review",
    type: "task",
    priority: "high",
    time: "Tomorrow",
    contact: "David Wilson",
    company: "MegaCorp",
    overdue: false,
    completed: false,
  },
  {
    id: 5,
    title: "Check-in with Alex",
    description: "Renewal options",
    type: "call",
    priority: "low",
    time: "This week",
    contact: "Alex Thompson",
    company: "Enterprise Co",
    overdue: false,
    completed: true,
  },
  {
    id: 6,
    title: "Send onboarding docs",
    description: "Welcome kit",
    type: "email",
    priority: "medium",
    time: "Yesterday",
    contact: "Jennifer Lee",
    company: "Acme Corp",
    overdue: false,
    completed: true,
  },
]

const typeIcons: Record<string, typeof Phone> = { call: Phone, email: Mail, meeting: Calendar, task: CheckCircle2 }
const typeLabels: Record<string, string> = { call: "Call", email: "Email", meeting: "Meet", task: "Task" }

export function TasksList() {
  const [taskList, setTaskList] = useState(tasks)

  const toggleTask = (id: number) => {
    setTaskList((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const pending = taskList.filter((t) => !t.completed)
  const completed = taskList.filter((t) => t.completed)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">{pending.length} pending tasks</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-3">
        <TabsList className="h-8">
          <TabsTrigger value="pending" className="text-xs h-7 gap-1.5">
            Pending <Badge variant="secondary" className="h-4 px-1 text-[10px]">{pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs h-7 gap-1.5">
            Completed <Badge variant="secondary" className="h-4 px-1 text-[10px]">{completed.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-1 mt-0">
          {pending.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-1 mt-0">
          {completed.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TaskRow({ task, onToggle }: { task: (typeof tasks)[0]; onToggle: (id: number) => void }) {
  const Icon = typeIcons[task.type] || CheckCircle2

  return (
    <div className={`flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-muted/50 group ${task.completed ? "opacity-50" : ""}`}>
      <button onClick={() => onToggle(task.id)} className="shrink-0">
        {task.completed ? (
          <CheckCircle2 className="h-4 w-4 text-accent" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground/50 hover:text-foreground" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</span>
          {task.overdue && <AlertCircle className="h-3 w-3 text-destructive" />}
          {task.priority === "high" && !task.completed && (
            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-destructive/10 text-destructive">High</Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {task.contact} &middot; {task.company}
        </p>
      </div>
      <span className={`shrink-0 text-xs ${task.overdue ? "text-destructive" : "text-muted-foreground"}`}>{task.time}</span>
      <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 px-2 text-xs">
        <Icon className="h-3 w-3" />
        {typeLabels[task.type]}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Reschedule</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
