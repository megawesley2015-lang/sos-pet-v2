import { supabase } from '@/lib/supabase';

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
      }
    }
  });

  if (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }

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

  if (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }

  return data;
}

/**
 * Logout
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }

  return true;
}

/**
 * Obter usuário atual
 */
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }

  return user;
}

/**
 * Obter sessão atual
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }

  return session;
}

/**
 * Recuperar senha
 */
export async function recuperarSenha(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    throw error;
  }

  return data;
}

/**
 * Atualizar senha
 */
export async function atualizarSenha(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }

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
