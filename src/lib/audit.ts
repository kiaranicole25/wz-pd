import { supabase } from '@/integrations/supabase/client';

export type AuditArea = 'sapd' | 'vetados' | 'noticias' | 'importantes' | 'auth' | 'usuarios';
export type AuditAction = 'crear' | 'editar' | 'borrar' | 'login_ok' | 'login_fail';

export async function logAction(
  actor: { username: string; role: 'encargado' | 'cupula' | 'anon' },
  area: AuditArea,
  action: AuditAction,
  detalle: string,
) {
  await supabase.from('audit_logs').insert({
    actor_username: actor.username,
    actor_role: actor.role,
    area,
    action,
    detalle,
  });
}
