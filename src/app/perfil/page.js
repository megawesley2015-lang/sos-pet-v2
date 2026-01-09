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
  
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

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
        data: {
          nome: formData.nome,
          telefone: formData.telefone,
        },
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch (err) {
      console.error("Erro ao atualizar:", err);
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
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#20B2AA] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white font-bold">
              {(formData.nome || user.email)?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Mensagem */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${
            message.type === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                O email não pode ser alterado
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-6 bg-[#20B2AA] hover:bg-[#1a9e97] disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </form>

        {/* Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <Link
            href="/meus-pets"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🐾</span>
              <span className="font-medium text-gray-700">Meus Pets</span>
            </span>
            <span className="text-gray-400">→</span>
          </Link>

          <Link
            href="/achados-e-perdidos/cadastrar"
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">➕</span>
              <span className="font-medium text-gray-700">Cadastrar Pet</span>
            </span>
            <span className="text-gray-400">→</span>
          </Link>

          <hr className="my-2" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-all text-red-600"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🚪</span>
              <span className="font-medium">Sair da conta</span>
            </span>
            <span>→</span>
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Membro desde {new Date(user.created_at).toLocaleDateString("pt-BR")}
        </p>
      </div>
    </main>
  );
}
