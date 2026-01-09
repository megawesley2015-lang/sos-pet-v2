"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Lista de emails de administradores (adicione o seu aqui)
const ADMIN_EMAILS = [
  "k-tron_16@hotmail.com",
  // Adicione mais admins aqui
];

const STATUS_CONFIG = {
  pendente: { label: "Pendente", bg: "bg-yellow-100", text: "text-yellow-700" },
  aprovado: { label: "Aprovado", bg: "bg-green-100", text: "text-green-700" },
  rejeitado: { label: "Rejeitado", bg: "bg-red-100", text: "text-red-700" },
};

const CATEGORIAS = {
  veterinario: "🏥 Veterinário",
  petshop: "🛒 Pet Shop",
  hotel: "🏨 Hotel Pet",
  banho_tosa: "✂️ Banho e Tosa",
  adestramento: "🎓 Adestramento",
  passeador: "🚶 Passeador",
  creche: "🏠 Creche",
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cadastros, setCadastros] = useState([]);
  const [stats, setStats] = useState({ pendentes: 0, aprovados: 0, rejeitados: 0 });
  const [filtro, setFiltro] = useState("pendente");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login?redirect=/admin");
          return;
        }

        setUser(session.user);

        // Verificar se é admin
        if (!ADMIN_EMAILS.includes(session.user.email)) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setIsAdmin(true);
        await fetchCadastros();
        await fetchStats();

      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [router]);

  const fetchCadastros = async (status = "pendente") => {
    const { data, error } = await supabase
      .from("cadastros_pendentes")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (!error) {
      setCadastros(data || []);
    }
  };

  const fetchStats = async () => {
    const { data: pendentes } = await supabase
      .from("cadastros_pendentes")
      .select("id", { count: "exact" })
      .eq("status", "pendente");

    const { data: aprovados } = await supabase
      .from("cadastros_pendentes")
      .select("id", { count: "exact" })
      .eq("status", "aprovado");

    const { data: rejeitados } = await supabase
      .from("cadastros_pendentes")
      .select("id", { count: "exact" })
      .eq("status", "rejeitado");

    setStats({
      pendentes: pendentes?.length || 0,
      aprovados: aprovados?.length || 0,
      rejeitados: rejeitados?.length || 0,
    });
  };

  const handleFiltroChange = async (novoFiltro) => {
    setFiltro(novoFiltro);
    await fetchCadastros(novoFiltro);
  };

  const handleAprovar = async (cadastro) => {
    if (!confirm(`Aprovar "${cadastro.nome}"?`)) return;

    setActionLoading(cadastro.id);

    try {
      // 1. Inserir na tabela prestadores
      const { error: insertError } = await supabase
        .from("prestadores")
        .insert({
          nome: cadastro.nome,
          categoria: cadastro.categoria,
          descricao: cadastro.descricao,
          telefone: cadastro.telefone,
          whatsapp: cadastro.whatsapp,
          email: cadastro.email,
          endereco: cadastro.endereco,
          cidade: cadastro.cidade,
          estado: cadastro.estado,
          cep: cadastro.cep,
          emergencia_24h: cadastro.emergencia_24h,
          aceita_plano: cadastro.aceita_plano,
          ativo: true,
        });

      if (insertError) throw insertError;

      // 2. Atualizar status do cadastro
      const { error: updateError } = await supabase
        .from("cadastros_pendentes")
        .update({ status: "aprovado" })
        .eq("id", cadastro.id);

      if (updateError) throw updateError;

      // 3. Atualizar lista
      setCadastros(cadastros.filter(c => c.id !== cadastro.id));
      await fetchStats();

      alert("Prestador aprovado com sucesso!");

    } catch (err) {
      console.error("Erro ao aprovar:", err);
      alert("Erro ao aprovar. Tente novamente.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejeitar = async (cadastro) => {
    const motivo = prompt("Motivo da rejeição (opcional):");
    
    if (motivo === null) return; // Cancelou

    setActionLoading(cadastro.id);

    try {
      const { error } = await supabase
        .from("cadastros_pendentes")
        .update({ 
          status: "rejeitado",
          motivo_rejeicao: motivo || null
        })
        .eq("id", cadastro.id);

      if (error) throw error;

      setCadastros(cadastros.filter(c => c.id !== cadastro.id));
      await fetchStats();

      alert("Cadastro rejeitado.");

    } catch (err) {
      console.error("Erro ao rejeitar:", err);
      alert("Erro ao rejeitar. Tente novamente.");
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
          <p className="mt-4 text-gray-500">Verificando permissões...</p>
        </div>
      </main>
    );
  }

  // Não autorizado
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">🚫</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">
            Esta área é exclusiva para administradores.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#20B2AA] text-white px-6 py-3 rounded-xl font-bold"
          >
            Voltar ao Início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            🔐 Dashboard Admin
          </h1>
          <p className="text-gray-500">
            Gerencie os cadastros de prestadores
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-yellow-600">{stats.pendentes}</p>
            <p className="text-yellow-700 font-medium">Pendentes</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-green-600">{stats.aprovados}</p>
            <p className="text-green-700 font-medium">Aprovados</p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-red-600">{stats.rejeitados}</p>
            <p className="text-red-700 font-medium">Rejeitados</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleFiltroChange(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filtro === key
                  ? config.bg + " " + config.text + " ring-2 ring-offset-2"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cadastros.length > 0 ? (
          <div className="space-y-4">
            {cadastros.map((cadastro) => {
              const isLoading = actionLoading === cadastro.id;
              
              return (
                <div
                  key={cadastro.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {CATEGORIAS[cadastro.categoria]?.split(" ")[0] || "🏪"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800">
                          {cadastro.nome}
                        </h3>
                      </div>

                      <p className="text-gray-500 text-sm mb-4">
                        {CATEGORIAS[cadastro.categoria] || cadastro.categoria}
                      </p>

                      {cadastro.descricao && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {cadastro.descricao}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500">
                          📞 {cadastro.telefone}
                        </p>
                        {cadastro.email && (
                          <p className="text-gray-500">
                            ✉️ {cadastro.email}
                          </p>
                        )}
                        <p className="text-gray-500">
                          📍 {cadastro.cidade}, {cadastro.estado}
                        </p>
                        <p className="text-gray-500">
                          🕐 {new Date(cadastro.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mt-4">
                        {cadastro.emergencia_24h && (
                          <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
                            🚨 24h
                          </span>
                        )}
                        {cadastro.aceita_plano && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                            💳 Aceita Plano
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    {filtro === "pendente" && (
                      <div className="flex lg:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAprovar(cadastro)}
                          disabled={isLoading}
                          className="flex-1 lg:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-bold transition-all"
                        >
                          {isLoading ? "..." : "✓ Aprovar"}
                        </button>
                        <button
                          onClick={() => handleRejeitar(cadastro)}
                          disabled={isLoading}
                          className="flex-1 lg:flex-none px-6 py-3 bg-red-100 hover:bg-red-200 disabled:bg-gray-100 text-red-700 rounded-xl font-bold transition-all"
                        >
                          ✕ Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="text-6xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum cadastro {filtro}
            </h2>
            <p className="text-gray-500">
              {filtro === "pendente" 
                ? "Não há cadastros aguardando aprovação" 
                : `Não há cadastros com status "${filtro}"`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
