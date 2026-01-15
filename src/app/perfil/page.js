"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "" });

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login?redirect=/perfil");
          return;
        }

        setUser(session.user);
        setFormData({
          nome: session.user.user_metadata?.nome || "",
          telefone: session.user.user_metadata?.telefone || "",
        });
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { nome: formData.nome, telefone: formData.telefone },
      });

      if (error) throw error;
      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (err) {
      setMessage({ type: "error", text: "Erro ao atualizar perfil." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 1; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4">
        {/* Avatar Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Orbital rings */}
            <div className="absolute -inset-4 rounded-full border border-cyan-500/20 animate-rotate-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
            </div>
            <div className="absolute -inset-8 rounded-full border border-purple-500/10 animate-rotate-slow" style={{animationDirection: 'reverse', animationDuration: '30s'}}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
            </div>
            
            {/* Avatar */}
            <div className="w-28 h-28 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <span className="text-5xl text-white font-black">
                {(formData.nome || user.email)?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white mt-8">Meu Perfil</h1>
          <p className="text-gray-400 flex items-center justify-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {user.email}
          </p>
        </div>

        {/* Mensagem */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 border ${
            message.type === "success" 
              ? "bg-green-500/20 border-green-500/30 text-green-400" 
              : "bg-red-500/20 border-red-500/30 text-red-400"
          }`}>
            <span className="flex items-center gap-2">
              {message.type === "success" ? "✓" : "✕"} {message.text}
            </span>
          </div>
        )}

        {/* Formulário */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <form onSubmit={handleSubmit} className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Nome</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">👤</span>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Telefone</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📱</span>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span>🔒</span> O email não pode ser alterado
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <span>💾</span> Salvar Alterações
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 space-y-2">
          <Link
            href="/meus-pets"
            className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 transition-all group"
          >
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🐾</span>
              </div>
              <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Meus Pets</span>
            </span>
            <span className="text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">→</span>
          </Link>

          <Link
            href="/achados-e-perdidos/cadastrar"
            className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800 transition-all group"
          >
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">➕</span>
              </div>
              <span className="font-medium text-gray-300 group-hover:text-white transition-colors">Cadastrar Pet</span>
            </span>
            <span className="text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition-all">→</span>
          </Link>

          <hr className="border-slate-800 my-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-500/10 transition-all group"
          >
            <span className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-xl">🚪</span>
              </div>
              <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors">Sair da conta</span>
            </span>
            <span className="text-red-500/50 group-hover:text-red-400 group-hover:translate-x-1 transition-all">→</span>
          </button>
        </div>

        {/* Member Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <span>📅</span>
            Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </main>
  );
}
