import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'
import TaskFormDialog from './TaskFormDialog'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
        <TaskFormDialog />
      </div>
    </SidebarProvider>
  )
}
