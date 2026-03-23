import { useMemo } from 'react'
import useTaskStore from '@/stores/useTaskStore'
import TaskCard from '@/components/TaskCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Index() {
  const { tasks, statusFilter, searchQuery, openNewTask } = useTaskStore()

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [tasks, statusFilter, searchQuery])

  if (filteredTasks.length === 0) {
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
          <h2 className="text-2xl font-bold text-slate-800">Nenhuma tarefa encontrada</h2>
          <p className="text-slate-500">
            {searchQuery
              ? 'Não conseguimos encontrar nenhuma tarefa correspondente à sua busca. Tente palavras-chave diferentes.'
              : 'Você não tem tarefas correspondentes a este filtro. Que tal organizar o seu dia e criar uma nova?'}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suas Tarefas</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe suas atividades diárias.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
