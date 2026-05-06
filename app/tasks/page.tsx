import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { TasksList } from "@/components/tasks-list"

export default function TasksPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-4xl">
            <TasksList />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
