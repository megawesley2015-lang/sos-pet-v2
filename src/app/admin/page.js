"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Lista de emails de administradores
const ADMIN_EMAILS = [
  "k-tron_16@hotmail.com",
  // Adicione mais admins aqui
];

const STATUS_CONFIG = {
  pendente: { label: "Pendente", bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  aprovado: { label: "Aprovado", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  rejeitado: { label: "Rejeitado", bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
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

    if (!error) setCadastros(data || []);
  };

  const fetchStats = async () => {
    const { data: pendentes } = await supabase.from("cadastros_pendentes").select("id", { count: "exact" }).eq("status", "pendente");
    const { data: aprovados } = await supabase.from("cadastros_pendentes").select("id", { count: "exact" }).eq("status", "aprovado");
    const { data: rejeitados } = await supabase.from("cadastros_pendentes").select("id", { count: "exact" }).eq("status", "rejeitado");

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
      const { error: insertError } = await supabase.from("prestadores").insert({
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

      const { error: updateError } = await supabase.from("cadastros_pendentes").update({ status: "aprovado" }).eq("id", cadastro.id);

      if (updateError) throw updateError;

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
    if (motivo === null) return;

    setActionLoading(cadastro.id);

    try {
      const { error } = await supabase.from("cadastros_pendentes").update({ status: "rejeitado", motivo_rejeicao: motivo || null }).eq("id", cadastro.id);

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
      <main className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400">Verificando permissões...</p>
        </div>
      </main>
    );
  }

  // Não autorizado
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <div className="bg-slate-900/50 border border-red-500/30 rounded-3xl p-12">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🚫</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h1>
            <p className="text-gray-400 mb-6">Esta área é exclusiva para administradores.</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-bold">
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-3xl font-black text-white">Dashboard Admin</h1>
          </div>
          <p className="text-gray-400">Gerencie os cadastros de prestadores</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-slate-900/50 border border-yellow-500/30 rounded-2xl p-6 text-center">
              <p className="text-5xl font-black text-yellow-400">{stats.pendentes}</p>
              <p className="text-yellow-500/80 font-medium mt-2">Pendentes</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-slate-900/50 border border-green-500/30 rounded-2xl p-6 text-center">
              <p className="text-5xl font-black text-green-400">{stats.aprovados}</p>
              <p className="text-green-500/80 font-medium mt-2">Aprovados</p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-slate-900/50 border border-red-500/30 rounded-2xl p-6 text-center">
              <p className="text-5xl font-black text-red-400">{stats.rejeitados}</p>
              <p className="text-red-500/80 font-medium mt-2">Rejeitados</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleFiltroChange(key)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filtro === key
                  ? `${config.bg} ${config.text} ${config.border} border`
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {cadastros.length > 0 ? (
          <div className="space-y-4">
            {cadastros.map((cadastro, index) => {
              const isLoading = actionLoading === cadastro.id;
              
              return (
                <div
                  key={cadastro.id}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all animate-float"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{CATEGORIAS[cadastro.categoria]?.split(" ")[0] || "🏪"}</span>
                        <h3 className="text-xl font-bold text-white">{cadastro.nome}</h3>
                      </div>

                      <p className="text-gray-500 text-sm mb-4">{CATEGORIAS[cadastro.categoria] || cadastro.categoria}</p>

                      {cadastro.descricao && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{cadastro.descricao}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p className="text-gray-500 flex items-center gap-2"><span>📞</span> {cadastro.telefone}</p>
                        {cadastro.email && <p className="text-gray-500 flex items-center gap-2"><span>✉️</span> {cadastro.email}</p>}
                        <p className="text-gray-500 flex items-center gap-2"><span>📍</span> {cadastro.cidade}, {cadastro.estado}</p>
                        <p className="text-gray-500 flex items-center gap-2"><span>🕐</span> {new Date(cadastro.created_at).toLocaleDateString("pt-BR")}</p>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mt-4">
                        {cadastro.emergencia_24h && (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3 py-1 rounded-full font-medium">🚨 24h</span>
                        )}
                        {cadastro.aceita_plano && (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-medium">💳 Aceita Plano</span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    {filtro === "pendente" && (
                      <div className="flex lg:flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAprovar(cadastro)}
                          disabled={isLoading}
                          className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold transition-all"
                        >
                          {isLoading ? "..." : "✓ Aprovar"}
                        </button>
                        <button
                          onClick={() => handleRejeitar(cadastro)}
                          disabled={isLoading}
                          className="flex-1 lg:flex-none px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl font-bold transition-all"
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
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <span className="text-6xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-white mb-2">Nenhum cadastro {filtro}</h2>
            <p className="text-gray-400">
              {filtro === "pendente" ? "Não há cadastros aguardando aprovação" : `Não há cadastros com status "${filtro}"`}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
