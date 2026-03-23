import { Search, Plus, User } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useTaskStore from '@/stores/useTaskStore'

export default function AppHeader() {
  const { searchQuery, setSearchQuery, openNewTask } = useTaskStore()

  return (
    <header className="sticky top-0 z-10 flex h-[4.5rem] shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 shadow-sm sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="relative flex-1 max-w-md ml-auto md:ml-0 transition-all duration-200 focus-within:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar tarefas..."
            className="w-full bg-muted/50 pl-9 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:border-border transition-colors h-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button onClick={openNewTask} className="hidden sm:flex rounded-full px-5 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button onClick={openNewTask} size="icon" className="sm:hidden rounded-full shadow-sm">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Nova Tarefa</span>
          </Button>
          <div className="h-8 w-px bg-border hidden sm:block mx-1"></div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-muted/50 border border-transparent"
          >
            <User className="h-5 w-5 text-slate-600" />
            <span className="sr-only">Perfil</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
