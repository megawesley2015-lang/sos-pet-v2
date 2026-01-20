import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variáveis de ambiente do Supabase não configuradas!\n' +
    'Verifique se .env.local existe na raiz do projeto com:\n' +
    '- NEXT_PUBLIC_SUPABASE_URL\n' +
    '- NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Cliente Supabase com configurações otimizadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Mais seguro para aplicações web
  },
});

/**
 * Interceptor de erros de autenticação
 * Detecta erros de refresh token e limpa sessão automaticamente
 */
export function handleAuthError(error) {
  if (!error) return;

  const isAuthError =
    error.message?.includes('Invalid Refresh Token') ||
    error.message?.includes('refresh_token_not_found') ||
    error.message?.includes('invalid_grant') ||
    error.status === 401;

  if (isAuthError) {
    console.warn('🔒 Sessão inválida detectada. Limpando autenticação...');

    // Limpar sessão do Supabase
    supabase.auth.signOut({ scope: 'local' }).catch(() => {
      // Fallback: limpar manualmente se signOut falhar
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      }
    });

    // Redirecionar para login apenas no cliente
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Evitar loop de redirect se já estiver em páginas públicas
      const publicPaths = ['/login', '/registro', '/esqueci-senha', '/'];

      if (!publicPaths.includes(currentPath)) {
        window.location.href = '/login?session_expired=true';
      }
    }

    return true; // Indica que o erro foi tratado
  }

  return false; // Não era erro de auth
}

/**
 * Wrapper seguro para getSession
 * Intercepta erros de refresh token automaticamente
 */
export async function getSessionSafe() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      handleAuthError(error);
      return { session: null, error };
    }

    return { session: data.session, error: null };
  } catch (error) {
    handleAuthError(error);
    return { session: null, error };
  }
}

/**
 * Wrapper seguro para getUser
 * Intercepta erros de refresh token automaticamente
 */
export async function getUserSafe() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      handleAuthError(error);
      return { user: null, error };
    }

    return { user: data.user, error: null };
  } catch (error) {
    handleAuthError(error);
    return { user: null, error };
  }
}
