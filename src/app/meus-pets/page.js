"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const STATUS_CONFIG = {
  perdido: { label: "PERDIDO", bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
  encontrado: { label: "ENCONTRADO", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  adocao: { label: "ADOÇÃO", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
};

export default function MeusPetsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/login?redirect=/meus-pets");
          return;
        }

        if (isMounted) setUser(session.user);

        // ✅ CORREÇÃO: Filtrar apenas pets ativos
        const { data: petsData, error: petsError } = await supabase
          .from("pets")
          .select("*")
          .eq("user_id", session.user.id)
          .eq("ativo", true)  // ← ADICIONADO: Filtra apenas ativos
          .order("created_at", { ascending: false });

        if (petsError) {
          if (isMounted) setError(`Erro ao carregar pets: ${petsError.message}`);
        } else if (isMounted) {
          setPets(petsData || []);
        }
      } catch (err) {
        if (isMounted) setError(`Erro inesperado: ${err.message}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") router.push("/login");
      else if (event === "SIGNED_IN" && session) setUser(session.user);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleDelete = async (petId) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    setActionLoading(petId);
    try {
      const { error } = await supabase
        .from("pets")
        .update({ ativo: false })
        .eq("id", petId);

      if (error) throw error;
      setPets(pets.filter((p) => p.id !== petId));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolver = async (petId) => {
    if (!confirm("Marcar como resolvido? O registro será removido da listagem pública.")) return;

    setActionLoading(petId);
    try {
      const { error } = await supabase
        .from("pets")
        .update({ ativo: false, status: "encontrado" })
        .eq("id", petId);

      if (error) throw error;
      setPets(pets.filter((p) => p.id !== petId));
    } catch (err) {
      console.error("Erro ao resolver:", err);
      alert("Erro ao marcar como resolvido. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400">Carregando seus pets...</p>
        </div>
      </main>
    );
  }

  // Erro
  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="bg-slate-900/50 border border-red-500/30 rounded-3xl p-12">
            <span className="text-6xl block mb-4">😿</span>
            <h1 className="text-2xl font-bold text-white mb-4">Ops! Algo deu errado</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                Tentar novamente
              </button>
              <Link href="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                Fazer login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); } 50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">🐾</span>
              </div>
              <h1 className="text-3xl font-black text-white">Meus Pets</h1>
            </div>
            <p className="text-gray-400">
              Olá, <span className="text-cyan-400 font-semibold">{user.user_metadata?.nome || user.email}</span>! 
              Gerencie seus registros aqui.
            </p>
          </div>

          <Link
            href="/achados-e-perdidos/cadastrar"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
          >
            <span>+</span> Novo Registro
          </Link>
        </div>

        {/* Lista de Pets */}
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map((pet, index) => {
              const statusConfig = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
              const isLoading = actionLoading === pet.id;
              
              return (
                <div
                  key={pet.id}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all animate-float"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagem */}
                    {pet.imagem_url ? (
                      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                        <img src={pet.imagem_url} alt={pet.nome || "Pet"} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full md:w-32 h-32 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-5xl">{pet.especie === "cao" ? "🐕" : pet.especie === "gato" ? "🐈" : "🐾"}</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border text-xs font-bold px-3 py-1 rounded-full`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(pet.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-1">{pet.nome || "Sem nome"}</h3>

                      <p className="text-gray-400 text-sm mb-2">
                        {pet.especie === "cao" ? "Cão" : pet.especie === "gato" ? "Gato" : pet.especie}
                        {pet.raca && ` • ${pet.raca}`}
                        {pet.cor && ` • ${pet.cor}`}
                      </p>

                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <span>📍</span> {pet.localizacao}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      <Link
                        href={`/achados-e-perdidos/${pet.id}`}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 rounded-lg font-medium text-sm text-center transition-all"
                      >
                        👁️ Ver
                      </Link>
                      
                      <Link
                        href={`/achados-e-perdidos/editar/${pet.id}`}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 rounded-lg font-medium text-sm text-center transition-all"
                      >
                        ✏️ Editar
                      </Link>
                      
                      <button
                        onClick={() => handleResolver(pet.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                      >
                        ✓ Resolvido
                      </button>

                      <button
                        onClick={() => handleDelete(pet.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Estado Vazio */
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center animate-pulse-glow">
                <span className="text-5xl">🐾</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Você ainda não tem registros</h2>
            <p className="text-gray-400 mb-6">Cadastre um pet perdido, encontrado ou para adoção</p>
            <Link
              href="/achados-e-perdidos/cadastrar"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
            >
              Cadastrar Pet
            </Link>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
          <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <span>💡</span> Dica
          </h3>
          <p className="text-gray-300 text-sm">
            Quando seu pet for encontrado ou quando um pet encontrado for devolvido ao tutor, 
            marque o registro como <strong className="text-cyan-400">"Resolvido"</strong>. Isso 
            ajuda a manter a listagem atualizada e organizada para todos.
          </p>
        </div>
      </div>
    </main>
  );
}
