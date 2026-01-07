"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registrar } from "@/services/auth.service";

export default function RegistroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      await registrar({
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Erro ao registrar:", err);

      if (err.message.includes("already registered")) {
        setError("Este email já está cadastrado");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <span className="text-6xl block mb-4">✉️</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verifique seu email!
            </h1>
            <p className="text-gray-600 mb-6">
              Enviamos um link de confirmação para{" "}
              <strong>{formData.email}</strong>. Clique no link para ativar sua
              conta.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Ir para o Login
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
          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Criar sua conta
          </h1>
          <p className="text-gray-500 mt-2">
            Cadastre-se para gerenciar seus pets e anúncios
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nome completo
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Digite a senha novamente"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#20B2AA]"
              />
              <span className="text-sm text-gray-600">
                Li e aceito os{" "}
                <Link href="/termos" className="text-[#20B2AA] font-medium">
                  Termos de Uso
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" className="text-[#20B2AA] font-medium">
                  Política de Privacidade
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Criando conta...
                </span>
              ) : (
                "Criar conta"
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

          {/* Link para login */}
          <p className="text-center text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#20B2AA] font-bold hover:underline"
            >
              Faça login
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
