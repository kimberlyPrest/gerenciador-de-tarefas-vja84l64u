import { Outlet } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import TaskFormDialog from './TaskFormDialog'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { signOut } = useAuth()

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-slate-500 hover:text-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto h-full">
              <Outlet />
            </div>
          </main>
        </div>
        <TaskFormDialog />
      </div>
    </SidebarProvider>
  )
}
