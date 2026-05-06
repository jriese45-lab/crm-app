"use client"

import { useState } from "react"
import { Mail, Phone, Building2, MoreHorizontal, Star, Plus, LayoutGrid, List, Search, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

const contacts = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah@techventures.com",
    phone: "+1 (555) 123-4567",
    company: "TechVentures Inc",
    role: "VP of Engineering",
    initials: "SC",
    starred: true,
    deals: 2,
    totalValue: "$56,500",
    lastTouch: "2h ago",
    nextTask: "Call today",
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike@globalsolutions.com",
    phone: "+1 (555) 234-5678",
    company: "Global Solutions",
    role: "CTO",
    initials: "MJ",
    starred: false,
    deals: 1,
    totalValue: "$15,200",
    lastTouch: "1d ago",
    nextTask: "Follow-up email",
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@startupxyz.io",
    phone: "+1 (555) 345-6789",
    company: "StartupXYZ",
    role: "Founder & CEO",
    initials: "ED",
    starred: true,
    deals: 3,
    totalValue: "$84,000",
    lastTouch: "3h ago",
    nextTask: "Send proposal",
  },
  {
    id: 4,
    name: "Alex Thompson",
    email: "alex@enterprise.co",
    phone: "+1 (555) 456-7890",
    company: "Enterprise Co",
    role: "IT Director",
    initials: "AT",
    starred: false,
    deals: 1,
    totalValue: "$8,750",
    lastTouch: "5h ago",
    nextTask: "Demo scheduled",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@datatech.com",
    phone: "+1 (555) 567-8901",
    company: "DataTech Solutions",
    role: "Head of Operations",
    initials: "LW",
    starred: false,
    deals: 1,
    totalValue: "$35,000",
    lastTouch: "Just now",
    nextTask: "Qualification call",
  },
  {
    id: 6,
    name: "David Wilson",
    email: "david@megacorp.com",
    phone: "+1 (555) 678-9012",
    company: "MegaCorp",
    role: "CFO",
    initials: "DW",
    starred: true,
    deals: 2,
    totalValue: "$120,000",
    lastTouch: "3d ago",
    nextTask: "Contract review",
  },
]

export function ContactsGrid() {
  const [view, setView] = useState<"cards" | "list">("cards")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Contacts</h1>
          <p className="text-sm text-muted-foreground">{contacts.length} contacts</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 pb-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="h-8 pl-8 text-sm" />
        </div>
        <div className="ml-auto flex items-center rounded-md border border-border p-0.5">
          <Button
            variant={view === "cards" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("cards")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Cards View */}
      {view === "cards" && (
        <div className="flex-1 overflow-auto">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="border-border bg-card group">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-secondary text-xs">{contact.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="truncate text-sm font-medium">{contact.name}</h3>
                          {contact.starred && <Star className="h-3 w-3 shrink-0 fill-chart-4 text-chart-4" />}
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{contact.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Add to deal</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Last: {contact.lastTouch}</span>
                    <span className="text-accent">{contact.nextTask}</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {contact.deals} {contact.deals === 1 ? "deal" : "deals"}
                    </Badge>
                    <span className="text-xs font-medium">{contact.totalValue}</span>
                  </div>
                  <div className="mt-2.5 flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-xs">
                      <Phone className="h-3 w-3" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 flex-1 gap-1 text-xs">
                      <Mail className="h-3 w-3" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card className="flex-1 overflow-hidden border-border bg-card">
          <CardContent className="h-full overflow-auto p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Touch</TableHead>
                  <TableHead>Next Task</TableHead>
                  <TableHead>Deals</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-secondary text-[10px]">{contact.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-medium">{contact.name}</span>
                            {contact.starred && <Star className="h-3 w-3 shrink-0 fill-chart-4 text-chart-4" />}
                          </div>
                          <span className="truncate text-[11px] text-muted-foreground">{contact.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{contact.company}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contact.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{contact.lastTouch}</TableCell>
                    <TableCell className="text-sm text-accent">{contact.nextTask}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">{contact.deals}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{contact.totalValue}</TableCell>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
