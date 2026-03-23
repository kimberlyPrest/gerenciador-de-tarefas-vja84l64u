import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function AppHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-white px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="bg-slate-100 p-1.5 rounded-full">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <span className="text-sm font-medium text-slate-600">{user?.email}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="text-slate-500 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  )
}
