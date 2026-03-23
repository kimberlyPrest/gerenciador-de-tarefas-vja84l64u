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
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  markAsDone: (id: string) => Promise<void>
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
    } catch (e: any) {
      toast.error(e.message || 'Erro ao carregar tarefas.')
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
      setTasks((prev) => [newTask, ...prev])
      setIsFormOpen(false)
      toast.success('Tarefa criada com sucesso!')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao criar tarefa.')
      throw e
    }
  }

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await tasksService.updateTask(id, taskData)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)))
      setIsFormOpen(false)
      toast.success('Tarefa atualizada!')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar tarefa.')
      throw e
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await tasksService.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Tarefa excluída.')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao excluir tarefa.')
      throw e
    }
  }

  const markAsDone = async (id: string) => {
    try {
      await tasksService.updateTask(id, { status: 'DONE' })
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t)))
      toast.success('Tarefa concluída!')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao concluir tarefa.')
      throw e
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
