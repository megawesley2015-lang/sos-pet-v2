"use client";

import { useState } from "react";
import Link from "next/link";
import { recuperarSenha } from "@/services/auth.service";

export default function EsqueciSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await recuperarSenha(email);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao recuperar senha:", err);
      setError("Erro ao enviar email. Verifique se o email está correto.");
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
              Email enviado!
            </h1>
            <p className="text-gray-600 mb-6">
              Enviamos um link de recuperação para{" "}
              <strong>{email}</strong>. Verifique sua caixa de entrada.
            </p>
            <Link
              href="/login"
              className="inline-block bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Voltar para o Login
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
            Recuperar senha
          </h1>
          <p className="text-gray-500 mt-2">
            Digite seu email para receber o link de recuperação
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Enviando...
                </span>
              ) : (
                "Enviar link de recuperação"
              )}
            </button>
          </form>

          {/* Link para login */}
          <p className="text-center text-gray-600 mt-6">
            Lembrou a senha?{" "}
            <Link
              href="/login"
              className="text-[#20B2AA] font-bold hover:underline"
            >
              Fazer login
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
