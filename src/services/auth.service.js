import { supabase } from "@/lib/supabase";

// URL base do site (produção ou desenvolvimento)
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://sos-pet-v2.vercel.app";
};

/**
 * Registrar novo usuário
 */
export async function registrar({ email, password, nome }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nome: nome,
      },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Login com email e senha
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Logout
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obter usuário atual
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Obter sessão atual
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Recuperar senha (enviar email)
 */
export async function recuperarSenha(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/auth/callback?type=recovery`,
  });

  if (error) throw error;
  return data;
}

/**
 * Atualizar senha
 */
export async function atualizarSenha(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

/**
 * Listener de mudanças de autenticação
 */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
