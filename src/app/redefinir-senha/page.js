"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Verificar se há sessão (necessário para redefinir senha)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login?error=session_expired");
        return;
      }
      
      setSessionChecked(true);
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError(err.message || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Verificando...</p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <span className="text-6xl block mb-4">✅</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Senha redefinida!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua nova senha foi salva com sucesso. Você será redirecionado...
            </p>
            <Link
              href="/"
              className="inline-block bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Ir para o início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🐾</span>
            <span className="text-3xl font-black text-[#FF6B35]">SOS Pet</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Redefinir Senha
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Digite sua nova senha abaixo
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nova senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Repita a senha"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#20B2AA] hover:bg-[#1a9e97] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                "Salvar nova senha"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
