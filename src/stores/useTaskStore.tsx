import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { toast } from 'sonner'
import { Task, TaskStatus } from '@/types'
import { tasksService } from '@/services/tasks'

interface TaskContextData {
  tasks: Task[]
  isLoading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: TaskStatus | 'ALL'
  setStatusFilter: (status: TaskStatus | 'ALL') => void
  isFormOpen: boolean
  setIsFormOpen: (open: boolean) => void
  editingTask: Task | null
  openNewTask: () => void
  openEditTask: (task: Task) => void
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  markAsDone: (id: string) => void
  refreshTasks: () => Promise<void>
}

const TaskContext = createContext<TaskContextData | undefined>(undefined)

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await tasksService.fetchTasks()
      setTasks(data)
    } catch (e) {
      toast.error('Erro ao carregar tarefas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const openNewTask = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTask = await tasksService.createTask(taskData)
      setTasks([newTask, ...tasks])
      setIsFormOpen(false)
      toast.success('Tarefa criada com sucesso!')
    } catch (e) {
      toast.error('Erro ao criar tarefa.')
    }
  }

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await tasksService.updateTask(id, taskData)
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)))
      setIsFormOpen(false)
      toast.success('Tarefa atualizada!')
    } catch (e) {
      toast.error('Erro ao atualizar tarefa.')
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await tasksService.deleteTask(id)
      setTasks(tasks.filter((t) => t.id !== id))
      toast.success('Tarefa excluída.')
    } catch (e) {
      toast.error('Erro ao excluir tarefa.')
    }
  }

  const markAsDone = async (id: string) => {
    try {
      await tasksService.updateTask(id, { status: 'DONE' })
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t)))
      toast.success('Tarefa concluída!')
    } catch (e) {
      toast.error('Erro ao concluir tarefa.')
    }
  }

  const value = useMemo(
    () => ({
      tasks,
      isLoading,
      searchQuery,
      setSearchQuery,
      statusFilter,
      setStatusFilter,
      isFormOpen,
      setIsFormOpen,
      editingTask,
      openNewTask,
      openEditTask,
      addTask,
      updateTask,
      deleteTask,
      markAsDone,
      refreshTasks: fetchTasks,
    }),
    [tasks, isLoading, searchQuery, statusFilter, isFormOpen, editingTask, fetchTasks],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export default function useTaskStore() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTaskStore must be used within a TaskProvider')
  return context
}
