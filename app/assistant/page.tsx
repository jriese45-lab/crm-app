import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AIChat } from "@/components/ai-chat"

export default function AssistantPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex flex-1 flex-col overflow-hidden">
          <AIChat />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
