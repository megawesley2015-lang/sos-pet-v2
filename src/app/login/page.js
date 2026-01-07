"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Redirecionar para home
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      
      if (err.message.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Confirme seu email antes de fazer login");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🐾</span>
            <span className="text-3xl font-black text-[#FF6B35]">SOS Pet</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Entrar na sua conta
          </h1>
          <p className="text-gray-500 mt-2">
            Acesse sua conta para gerenciar seus pets e anúncios
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#20B2AA]"
                />
                <span className="text-sm text-gray-600">Lembrar de mim</span>
              </label>

              <Link
                href="/esqueci-senha"
                className="text-sm text-[#20B2AA] font-medium hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Link para registro */}
          <p className="text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/registro"
              className="text-[#20B2AA] font-bold hover:underline"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        {/* Voltar */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-[#20B2AA] font-medium"
          >
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  );
}
