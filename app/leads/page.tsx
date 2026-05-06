import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { LeadsList } from "@/components/leads-list"

export default function LeadsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-hidden p-4 lg:p-6">
          <LeadsList />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
