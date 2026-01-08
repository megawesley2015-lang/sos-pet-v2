"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const STATUS_CONFIG = {
  perdido: { label: "PERDIDO", bg: "bg-red-100", text: "text-red-600" },
  encontrado: { label: "ENCONTRADO", bg: "bg-green-100", text: "text-green-600" },
  adocao: { label: "ADOÇÃO", bg: "bg-blue-100", text: "text-blue-600" },
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
        // Primeiro, tentar obter a sessão
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session check:", { session, sessionError });

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
          if (isMounted) {
            setError("Erro ao verificar autenticação");
            setLoading(false);
          }
          return;
        }

        if (!session) {
          console.log("Sem sessão, redirecionando para login");
          router.push("/login?redirect=/meus-pets");
          return;
        }

        if (isMounted) {
          setUser(session.user);
        }

        // Buscar pets do usuário
        console.log("Buscando pets para user_id:", session.user.id);
        
        const { data: petsData, error: petsError } = await supabase
          .from("pets")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        console.log("Pets result:", { petsData, petsError });

        if (petsError) {
          console.error("Erro ao buscar pets:", petsError);
          if (isMounted) {
            setError(`Erro ao carregar pets: ${petsError.message}`);
          }
        } else if (isMounted) {
          setPets(petsData || []);
        }

      } catch (err) {
        console.error("Erro geral:", err);
        if (isMounted) {
          setError(`Erro inesperado: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === "SIGNED_OUT") {
        router.push("/login");
      } else if (event === "SIGNED_IN" && session) {
        setUser(session.user);
      }
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
        .update({ ativo: false })
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
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando seus pets...</p>
        </div>
      </main>
    );
  }

  // Erro
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">😿</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ops! Algo deu errado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-6 py-3 rounded-xl font-bold"
            >
              Tentar novamente
            </button>
            <Link
              href="/login"
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold"
            >
              Fazer login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Sem usuário (não deveria chegar aqui, mas por segurança)
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Meus Pets
            </h1>
            <p className="text-gray-500">
              Olá, <strong>{user.user_metadata?.nome || user.email}</strong>! 
              Gerencie seus registros aqui.
            </p>
          </div>

          <Link
            href="/achados-e-perdidos/cadastrar"
            className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            + Novo Registro
          </Link>
        </div>

        {/* Lista de Pets */}
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map((pet) => {
              const statusConfig = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
              const isLoading = actionLoading === pet.id;
              
              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Imagem */}
                    {pet.imagem_url ? (
                      <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={pet.imagem_url}
                          alt={pet.nome || "Pet"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full md:w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">
                          {pet.especie === "cao" ? "🐕" : pet.especie === "gato" ? "🐈" : "🐾"}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`${statusConfig.bg} ${statusConfig.text} text-xs font-bold px-3 py-1 rounded-full`}>
                          {statusConfig.label}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(pet.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {pet.nome || "Sem nome"}
                      </h3>

                      <p className="text-gray-600 text-sm mb-2">
                        {pet.especie === "cao" ? "Cão" : pet.especie === "gato" ? "Gato" : pet.especie}
                        {pet.raca && ` • ${pet.raca}`}
                        {pet.cor && ` • ${pet.cor}`}
                      </p>

                      <p className="text-gray-500 text-sm">
                        📍 {pet.localizacao}
                      </p>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                      <Link
                        href={`/achados-e-perdidos/${pet.id}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm text-center transition-all"
                      >
                        👁️ Ver
                      </Link>
                      
                      <Link
                        href={`/achados-e-perdidos/editar/${pet.id}`}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium text-sm text-center transition-all"
                      >
                        ✏️ Editar
                      </Link>
                      
                      <button
                        onClick={() => handleResolver(pet.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
                      >
                        ✓ Resolvido
                      </button>

                      <button
                        onClick={() => handleDelete(pet.id)}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium text-sm transition-all disabled:opacity-50"
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
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="text-6xl block mb-4">🐾</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Você ainda não tem registros
            </h2>
            <p className="text-gray-500 mb-6">
              Cadastre um pet perdido, encontrado ou para adoção
            </p>
            <Link
              href="/achados-e-perdidos/cadastrar"
              className="inline-block bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Cadastrar Pet
            </Link>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-[#20B2AA]/10 rounded-2xl p-6">
          <h3 className="font-bold text-[#20B2AA] mb-2">💡 Dica</h3>
          <p className="text-gray-600 text-sm">
            Quando seu pet for encontrado ou quando um pet encontrado for devolvido
            ao tutor, marque o registro como <strong>"Resolvido"</strong>. Isso
            ajuda a manter a listagem atualizada e organizada para todos.
          </p>
        </div>

        {/* Debug info (remover depois) */}
        <div className="mt-4 p-4 bg-gray-100 rounded-xl text-xs text-gray-500">
          <p><strong>Debug:</strong> User ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Pets encontrados: {pets.length}</p>
        </div>
      </div>
    </main>
  );
}
