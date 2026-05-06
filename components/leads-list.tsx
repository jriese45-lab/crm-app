"use client"

import { useState } from "react"
import { MoreHorizontal, Mail, Phone, Building2, Filter, Plus, ChevronDown, ArrowUpRight, Trash2, Edit, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const leads = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@techventures.com",
    company: "TechVentures Inc",
    phone: "+1 (555) 123-4567",
    status: "qualified",
    value: "$28,500",
    source: "Website",
    lastContact: "2h ago",
    initials: "SC",
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike@globalsolutions.com",
    company: "Global Solutions",
    phone: "+1 (555) 234-5678",
    status: "new",
    value: "$15,200",
    source: "LinkedIn",
    lastContact: "1d ago",
    initials: "MJ",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@startupxyz.io",
    company: "StartupXYZ",
    phone: "+1 (555) 345-6789",
    status: "contacted",
    value: "$42,000",
    source: "Referral",
    lastContact: "3h ago",
    initials: "ED",
  },
  {
    id: 4,
    name: "Alex Thompson",
    email: "alex@enterprise.co",
    company: "Enterprise Co",
    phone: "+1 (555) 456-7890",
    status: "qualified",
    value: "$8,750",
    source: "Cold Email",
    lastContact: "5h ago",
    initials: "AT",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@datatech.com",
    company: "DataTech Solutions",
    phone: "+1 (555) 567-8901",
    status: "new",
    value: "$35,000",
    source: "Trade Show",
    lastContact: "Just now",
    initials: "LW",
  },
]

const statusColors: Record<string, string> = {
  new: "bg-chart-2/10 text-chart-2",
  contacted: "bg-chart-4/10 text-chart-4",
  qualified: "bg-accent/10 text-accent",
  proposal: "bg-chart-3/10 text-chart-3",
}

const filters = ["All", "New", "Contacted", "Qualified", "Proposal"]

export function LeadsList() {
  const [activeFilter, setActiveFilter] = useState("All")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">{leads.length} total leads</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 pb-3">
        {filters.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </Button>
        ))}
        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:flex-nowrap">
          <Input placeholder="Search leads..." className="h-8 w-40 text-sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                <Filter className="h-3.5 w-3.5" />
                More Filters
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>By Source</DropdownMenuItem>
              <DropdownMenuItem>By Value</DropdownMenuItem>
              <DropdownMenuItem>By Last Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <Card className="min-w-0 flex-1 overflow-hidden border-border bg-card">
        <CardContent className="h-full min-w-0 overflow-auto p-0">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px]">Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead className="w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-secondary text-[10px]">{lead.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{lead.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {lead.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`capitalize text-[10px] ${statusColors[lead.status]}`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{lead.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.source}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.lastContact}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Call">
                        <Phone className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Email">
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ArrowRight className="mr-2 h-3.5 w-3.5" />
                            Move to Pipeline
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
