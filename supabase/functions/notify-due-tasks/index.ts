import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from '@supabase/supabase-js'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

Deno.serve(async (req) => {
  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set')
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials are not set')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const { data: tasks, error: fetchError } = await supabase
      .from('tasks')
      .select('id, title, due_date, user_id')
      .eq('email_sent', false)
      .neq('status', 'DONE')
      .not('due_date', 'is', null)
      .lte('due_date', threeDaysFromNow.toISOString())

    if (fetchError) throw fetchError

    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ message: 'No tasks to notify' }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const results = []

    for (const task of tasks) {
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
        task.user_id,
      )

      if (userError || !userData?.user?.email) {
        console.error(`Could not fetch user ${task.user_id}:`, userError)
        continue
      }

      const userEmail = userData.user.email

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Gerenciador de Tarefas <onboarding@resend.dev>',
          to: userEmail,
          subject: `Aviso: A tarefa "${task.title}" vence em breve!`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #0f172a;">Lembrete de Vencimento</h2>
              <p style="color: #334155; font-size: 16px;">Olá,</p>
              <p style="color: #334155; font-size: 16px;">
                Este é um lembrete automático de que a sua tarefa <strong>${task.title}</strong> 
                está programada para vencer no dia ${new Date(task.due_date).toLocaleDateString('pt-BR')}.
              </p>
              <p style="color: #334155; font-size: 16px;">Não se esqueça de concluí-la no sistema!</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p style="color: #94a3b8; font-size: 14px;">Gerenciador de Tarefas</p>
            </div>
          `,
        }),
      })

      if (resendRes.ok) {
        await supabase.from('tasks').update({ email_sent: true }).eq('id', task.id)

        results.push({ task: task.id, status: 'sent' })
      } else {
        const errorText = await resendRes.text()
        console.error(`Failed to send email for task ${task.id}:`, errorText)
        results.push({ task: task.id, status: 'error', error: errorText })
      }
    }

    return new Response(JSON.stringify({ message: 'Notifications processed', results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
