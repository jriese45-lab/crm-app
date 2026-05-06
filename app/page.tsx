import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { PipelinePreview } from "@/components/pipeline-preview"
import { TodaysFollowups } from "@/components/todays-followups"
import { AIAssistantPanel } from "@/components/ai-assistant-panel"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4">
            {/* Stats Row */}
            <DashboardStats />

            {/* AI Command Center - Full Width */}
            <AIAssistantPanel />

            {/* Main Grid */}
            <div className="grid gap-4 lg:grid-cols-5">
              {/* Left: Follow-ups & Pipeline */}
              <div className="space-y-4 lg:col-span-3">
                <TodaysFollowups />
                <PipelinePreview />
              </div>
              {/* Right: Activity */}
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
