-- Adiciona a coluna email_sent na tabela de tarefas
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS email_sent BOOLEAN NOT NULL DEFAULT FALSE;

-- Habilita as extensões necessárias para o cron job
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Remove o job caso já exista para garantir a idempotência
DO $$
BEGIN
  PERFORM cron.unschedule('notify-due-tasks-daily');
EXCEPTION WHEN OTHERS THEN
  -- ignora se o job não existir
END;
$$;

-- Cria o cron job para executar diariamente à meia-noite
-- Em produção, a URL deve ser atualizada para apontar para o seu projeto real
SELECT cron.schedule(
  'notify-due-tasks-daily',
  '0 0 * * *',
  $cron$
    SELECT net.http_post(
      url := 'http://localhost:54321/functions/v1/notify-due-tasks',
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  $cron$
);
