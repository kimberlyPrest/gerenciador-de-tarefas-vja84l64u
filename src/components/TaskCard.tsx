import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, MoreVertical, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useTaskStore from '@/stores/useTaskStore'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG = {
  TODO: {
    border: 'border-l-slate-400',
    badge: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    label: 'A Fazer',
  },
  IN_PROGRESS: {
    border: 'border-l-amber-500',
    badge: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    label: 'Em Progresso',
  },
  DONE: {
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    label: 'Concluído',
  },
}

export default function TaskCard({ task }: { task: Task }) {
  const { openEditTask, deleteTask, markAsDone } = useTaskStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const config = STATUS_CONFIG[task.status]

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md border-l-4',
          config.border,
        )}
      >
        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 pr-4">
          <div className="space-y-1 pr-6">
            <CardTitle className="text-lg leading-tight font-semibold line-clamp-2">
              {task.title}
            </CardTitle>
            <Badge className={cn('font-medium', config.badge)} variant="secondary">
              {config.label}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-2 top-4">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => openEditTask(task)}>
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
              {task.status !== 'DONE' && (
                <DropdownMenuItem onClick={() => markAsDone(task.id)}>
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Concluir</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Deletar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
            {task.description || 'Nenhuma descrição fornecida.'}
          </p>
        </CardContent>
        <CardFooter className="pt-0 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>
              {task.dueDate
                ? format(task.dueDate, "dd 'de' MMM, yyyy", { locale: ptBR })
                : 'Sem data'}
            </span>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a tarefa "{task.title}
              ".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTask(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Deletar Tarefa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
