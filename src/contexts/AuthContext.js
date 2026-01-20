"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getSessionSafe, handleAuthError } from '@/lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial com interceptor de erro
    const getInitialSession = async () => {
      try {
        const { session, error } = await getSessionSafe();

        if (error) {
          console.warn('Erro ao obter sessão inicial:', error.message);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erro crítico ao obter sessão:', error);
        handleAuthError(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        // Detectar erros de token e limpar sessão
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.warn('Token refresh falhou, limpando sessão');
          handleAuthError({ message: 'Invalid Refresh Token' });
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
