import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { toast } from 'sonner'
import { Task, TaskStatus } from '@/types'

interface TaskContextData {
  tasks: Task[]
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
}

const TaskContext = createContext<TaskContextData | undefined>(undefined)

const generateId = () => Math.random().toString(36).substring(2, 9)

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Comprar mantimentos',
    description: 'Leite, ovos, pão e café.',
    status: 'TODO',
    createdAt: new Date(),
    dueDate: new Date(Date.now() + 86400000),
  },
  {
    id: '2',
    title: 'Reunião de Alinhamento',
    description: 'Discutir a nova funcionalidade com a equipe.',
    status: 'IN_PROGRESS',
    createdAt: new Date(),
    dueDate: new Date(),
  },
  {
    id: '3',
    title: 'Atualizar documentação',
    description: 'Revisar e atualizar a doc do projeto.',
    status: 'DONE',
    createdAt: new Date(),
    dueDate: new Date(Date.now() - 86400000),
  },
]

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const openNewTask = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = { ...taskData, id: generateId(), createdAt: new Date() }
    setTasks([newTask, ...tasks])
    setIsFormOpen(false)
    toast.success('Tarefa criada com sucesso!')
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...taskData } : t)))
    setIsFormOpen(false)
    toast.success('Tarefa atualizada!')
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
    toast.success('Tarefa excluída.')
  }

  const markAsDone = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'DONE' } : t)))
    toast.success('Tarefa concluída!')
  }

  const value = useMemo(
    () => ({
      tasks,
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
    }),
    [tasks, searchQuery, statusFilter, isFormOpen, editingTask],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export default function useTaskStore() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTaskStore must be used within a TaskProvider')
  return context
}
