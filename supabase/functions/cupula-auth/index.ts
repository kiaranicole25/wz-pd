import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const ENCARGADO_PASSWORD = 'S-nrR3@7gK?hQYQ';

// Hash password using Web Crypto API (PBKDF2 con SHA-256). Funciona en Deno edge sin Worker.
function bytesToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations = 100_000): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return bytesToHex(bits);
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100_000;
  const hash = await pbkdf2(password, salt, iterations);
  return `pbkdf2$${iterations}$${bytesToHex(salt.buffer)}$${hash}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [scheme, iterStr, saltHex, hashHex] = stored.split('$');
    if (scheme !== 'pbkdf2') return false;
    const iterations = parseInt(iterStr, 10);
    const salt = hexToBytes(saltHex);
    const calc = await pbkdf2(password, salt, iterations);
    // constant-time compare
    if (calc.length !== hashHex.length) return false;
    let diff = 0;
    for (let i = 0; i < calc.length; i++) diff |= calc.charCodeAt(i) ^ hashHex.charCodeAt(i);
    return diff === 0;
  } catch {
    return false;
  }
}

async function logAudit(actor: string, role: string, area: string, action: string, detalle: string) {
  await supabase.from('audit_logs').insert({
    actor_username: actor, actor_role: role, area, action, detalle,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { op } = body;

    // ---------- LOGIN ENCARGADO ----------
    if (op === 'login_encargado') {
      const { password } = body;
      if (password === ENCARGADO_PASSWORD) {
        await logAudit('Superusuario Administrador', 'encargado', 'auth', 'login_ok', 'Ingresó como Encargado');
        return json({ ok: true, role: 'encargado', username: 'Superusuario Administrador' });
      }
      return json({ ok: false, error: 'Credenciales Incorrectas' }, 401);
    }

    // ---------- LOGIN CUPULA ----------
    if (op === 'login_cupula') {
      const { username, password } = body;
      if (!username || !password) return json({ ok: false, error: 'Datos incompletos' }, 400);

      const { data: user } = await supabase
        .from('cupula_users')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (!user) {
        await logAudit(username, 'anon', 'auth', 'login_fail',
          `${username} intentó ingresar al modo admin - nombre y pass erróneos`);
        return json({ ok: false, error: 'Credenciales incorrectas' }, 401);
      }

      const ok = await verifyPassword(password, user.password_hash);
      if (!ok) {
        await logAudit(username, 'anon', 'auth', 'login_fail',
          `${username} intentó ingresar al modo admin - nombre y pass erróneos`);
        return json({ ok: false, error: 'Credenciales incorrectas' }, 401);
      }

      await logAudit(username, 'cupula', 'auth', 'login_ok', `${username} ingresó como Cúpula`);
      return json({
        ok: true,
        role: 'cupula',
        username: user.username,
        permissions: {
          sapd: user.perm_sapd,
          vetados: user.perm_vetados,
          noticias: user.perm_noticias,
          importantes: user.perm_importantes,
        },
      });
    }

    // ---------- CREAR USUARIO CUPULA (solo encargado) ----------
    if (op === 'create_user') {
      const { encargado_password, username, password, permissions, actor } = body;
      if (encargado_password !== ENCARGADO_PASSWORD) {
        return json({ ok: false, error: 'No autorizado' }, 403);
      }
      if (!username || !password) return json({ ok: false, error: 'Datos incompletos' }, 400);
      if (username.length > 50 || password.length > 100) {
        return json({ ok: false, error: 'Datos demasiado largos' }, 400);
      }

      const hash = await hashPassword(password);
      const { error } = await supabase.from('cupula_users').insert({
        username,
        password_hash: hash,
        perm_sapd: !!permissions?.sapd,
        perm_vetados: !!permissions?.vetados,
        perm_noticias: !!permissions?.noticias,
        perm_importantes: !!permissions?.importantes,
      });
      if (error) return json({ ok: false, error: error.message }, 400);

      await logAudit(actor || 'Superusuario Administrador', 'encargado', 'usuarios', 'crear',
        `Creó usuario Cúpula: ${username}`);
      return json({ ok: true });
    }

    // ---------- BORRAR USUARIO CUPULA (solo encargado) ----------
    if (op === 'delete_user') {
      const { encargado_password, user_id, actor } = body;
      if (encargado_password !== ENCARGADO_PASSWORD) {
        return json({ ok: false, error: 'No autorizado' }, 403);
      }
      const { data: u } = await supabase.from('cupula_users').select('username').eq('id', user_id).maybeSingle();
      const { error } = await supabase.from('cupula_users').delete().eq('id', user_id);
      if (error) return json({ ok: false, error: error.message }, 400);

      await logAudit(actor || 'Superusuario Administrador', 'encargado', 'usuarios', 'borrar',
        `Eliminó usuario Cúpula: ${u?.username ?? user_id}`);
      return json({ ok: true });
    }

    return json({ ok: false, error: 'op desconocida' }, 400);
  } catch (e) {
    return json({ ok: false, error: String((e as Error).message) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
