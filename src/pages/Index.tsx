import { useMemo } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import TaskCard from '@/components/TaskCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2, Search } from 'lucide-react'

export default function Index() {
  const { tasks, statusFilter, searchQuery, setSearchQuery, openNewTask, isLoading } =
    useTaskStore()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [tasks, statusFilter, searchQuery])

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center space-y-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">Carregando suas tarefas...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
          <img
            src="https://img.usecurling.com/i?q=clipboard&color=gradient&shape=hand-drawn"
            alt="Nenhuma tarefa"
            className="h-40 w-40 relative z-10"
          />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-slate-800">Nenhuma tarefa cadastrada</h2>
          <p className="text-slate-500">
            Você ainda não tem tarefas. Que tal organizar o seu dia e criar uma nova?
          </p>
        </div>
        <Button onClick={openNewTask} className="rounded-full px-6 mt-4">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Tarefa
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suas Tarefas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas atividades diárias.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar tarefas..."
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openNewTask} className="hidden sm:flex rounded-full shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Nova Tarefa
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <h3 className="text-lg font-medium text-slate-800">Nenhuma tarefa encontrada</h3>
          <p className="text-slate-500 mt-1">
            Não encontramos nada correspondente à sua busca atual.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <Button
        onClick={openNewTask}
        size="icon"
        className="sm:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
