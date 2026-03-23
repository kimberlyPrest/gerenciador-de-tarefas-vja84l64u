import { supabase } from '@/lib/supabase/client'
import { Task } from '@/types'

const mapRowToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  status: row.status as Task['status'],
  dueDate: row.due_date ? new Date(row.due_date) : undefined,
  createdAt: new Date(row.created_at),
  emailSent: row.email_sent,
})

export const tasksService = {
  async fetchTasks() {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data || []).map(mapRowToTask)
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'emailSent'>) {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userData.user.id,
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.dueDate?.toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return mapRowToTask(data)
  },

  async updateTask(id: string, task: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.dueDate?.toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return mapRowToTask(data)
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
  },
}
