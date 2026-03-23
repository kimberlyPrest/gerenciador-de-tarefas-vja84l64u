import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar'
import { LayoutDashboard, ListTodo, Clock, CheckCircle2, List } from 'lucide-react'
import useTaskStore from '@/stores/useTaskStore'

export default function AppSidebar() {
  const { tasks, statusFilter, setStatusFilter } = useTaskStore()

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((t) => t.status === 'DONE').length,
  }

  const filters = [
    { id: 'ALL', label: 'Todas', icon: List, count: counts.ALL },
    { id: 'TODO', label: 'A Fazer', icon: ListTodo, count: counts.TODO },
    { id: 'IN_PROGRESS', label: 'Em Progresso', icon: Clock, count: counts.IN_PROGRESS },
    { id: 'DONE', label: 'Concluído', icon: CheckCircle2, count: counts.DONE },
  ] as const

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-4 md:p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="bg-primary/10 p-2 rounded-lg">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <span>TaskMaster</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Visões
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {filters.map((filter) => (
                <SidebarMenuItem key={filter.id}>
                  <SidebarMenuButton
                    isActive={statusFilter === filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className="cursor-pointer font-medium py-2"
                  >
                    <filter.icon className="h-4 w-4 opacity-70" />
                    <span>{filter.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge className="bg-slate-100 text-slate-600 rounded-full px-2">
                    {filter.count}
                  </SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
