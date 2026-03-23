import { useEffect, useState } from 'react'
import { isBefore, startOfDay } from 'date-fns'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import useTaskStore from '@/stores/useTaskStore'
import { TaskStatus } from '@/types'

export default function TaskFormDialog() {
  const { isFormOpen, setIsFormOpen, editingTask, addTask, updateTask } = useTaskStore()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<TaskStatus>('TODO')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isFormOpen) {
      setTitle(editingTask?.title || '')
      setDescription(editingTask?.description || '')
      setDueDate(editingTask?.dueDate || undefined)
      setStatus(editingTask?.status || 'TODO')
      setError('')
      setIsSaving(false)
    }
  }, [isFormOpen, editingTask])

  const handleSave = async () => {
    if (!title.trim()) {
      setError('O título é obrigatório.')
      return
    }

    if (dueDate && isBefore(startOfDay(dueDate), startOfDay(new Date()))) {
      setError('A data de vencimento não pode estar no passado.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      if (editingTask) {
        await updateTask(editingTask.id, { title, description, dueDate, status })
      } else {
        await addTask({ title, description, dueDate, status })
      }
    } catch (e) {
      // Error is handled by the store (toast)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isFormOpen} onOpenChange={(open) => !isSaving && setIsFormOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              placeholder="Ex: Pagar a conta de luz"
              className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              disabled={isSaving}
            />
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione detalhes sobre a tarefa..."
              className="resize-none h-24"
              disabled={isSaving}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col justify-end">
              <Label>Vencimento</Label>
              <DatePicker
                date={dueDate}
                setDate={(date) => {
                  setDueDate(date)
                  if (error) setError('')
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as TaskStatus)}
                disabled={isSaving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">A Fazer</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                  <SelectItem value="DONE">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsFormOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Tarefa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
