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
      <main className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✉️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Email enviado!</h1>
            <p className="text-gray-400 mb-6">
              Enviamos um link de recuperação para <span className="text-cyan-400 font-semibold">{email}</span>. 
              Verifique sua caixa de entrada.
            </p>
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Voltar para o Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
        
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#3b82f6" />
              <path d="M50 0 V30 M50 70 V100 M0 50 H30 M70 50 H100" stroke="#3b82f6" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 w-full h-full rounded-full border border-blue-500/30 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
              </div>
              <div className="absolute inset-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-blue-500/20">
                <span className="text-3xl">🔑</span>
              </div>
            </div>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">SOS Pet</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6">Recuperar senha</h1>
          <p className="text-gray-400 mt-2">Digite seu email para receber o link de recuperação</p>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8">
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-white placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
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

            <p className="text-center text-gray-400 mt-6">
              Lembrou a senha?{" "}
              <Link href="/login" className="text-cyan-400 font-bold hover:text-cyan-300">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-blue-400 font-medium flex items-center justify-center gap-2">
            <span>←</span> Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  );
}
