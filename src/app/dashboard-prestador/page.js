"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * Dashboard do Prestador
 * 
 * Área exclusiva para prestadores gerenciarem:
 * - Perfil e informações
 * - Estatísticas de visualizações
 * - Avaliações recebidas
 * - Status de verificação
 * 
 * @returns {JSX.Element}
 */
export default function DashboardPrestador() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [prestador, setPrestador] = useState(null);
  const [stats, setStats] = useState({
    visualizacoes: 0,
    cliques_whatsapp: 0,
    avaliacoes: 0,
    media_notas: 0,
  });
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("visao-geral");

  // Verificar autenticação e buscar dados
  useEffect(() => {
    async function loadData() {
      try {
        // Verificar sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/login?redirect=/dashboard-prestador");
          return;
        }

        setUser(session.user);

        // Buscar prestador do usuário
        const { data: prestadorData, error: prestadorError } = await supabase
          .from("prestadores")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (prestadorError || !prestadorData) {
          // Usuário não é prestador
          router.push("/cadastro");
          return;
        }

        setPrestador(prestadorData);

        // Buscar estatísticas
        const { data: statsData } = await supabase
          .from("prestador_stats")
          .select("*")
          .eq("prestador_id", prestadorData.id)
          .single();

        if (statsData) {
          setStats({
            visualizacoes: statsData.visualizacoes || 0,
            cliques_whatsapp: statsData.cliques_whatsapp || 0,
            avaliacoes: statsData.total_avaliacoes || 0,
            media_notas: statsData.media_notas || 0,
          });
        }

        // Buscar avaliações
        const { data: avaliacoesData } = await supabase
          .from("avaliacoes")
          .select("*")
          .eq("prestador_id", prestadorData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        setAvaliacoes(avaliacoesData || []);

        // Calcular stats de avaliações se não tiver tabela de stats
        if (!statsData && avaliacoesData && avaliacoesData.length > 0) {
          const media = avaliacoesData.reduce((acc, a) => acc + a.nota, 0) / avaliacoesData.length;
          setStats(prev => ({
            ...prev,
            avaliacoes: avaliacoesData.length,
            media_notas: media,
          }));
        }

      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  if (!prestador) {
    return null;
  }

  const tabs = [
    { id: "visao-geral", label: "Visão Geral", emoji: "📊" },
    { id: "perfil", label: "Meu Perfil", emoji: "👤" },
    { id: "avaliacoes", label: "Avaliações", emoji: "⭐" },
    { id: "configuracoes", label: "Configurações", emoji: "⚙️" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                Dashboard do Prestador
              </h1>
              <p className="text-gray-500 mt-1">
                Bem-vindo, {prestador.nome}! 👋
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                prestador.status === "aprovado" 
                  ? "bg-green-100 text-green-700" 
                  : prestador.status === "pendente"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {prestador.status === "aprovado" ? "✓ Aprovado" : 
                 prestador.status === "pendente" ? "⏳ Pendente" : "❌ Rejeitado"}
              </span>
              
              <Link
                href={`/prestadores/${prestador.slug || prestador.id}`}
                className="px-4 py-2 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all"
              >
                Ver Página Pública
              </Link>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#20B2AA] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === "visao-geral" && (
          <div className="space-y-8">
            {/* Cards de Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-2">👀</div>
                <div className="text-3xl font-black text-gray-800">{stats.visualizacoes}</div>
                <div className="text-sm text-gray-500">Visualizações</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-3xl font-black text-gray-800">{stats.cliques_whatsapp}</div>
                <div className="text-sm text-gray-500">Cliques no WhatsApp</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-3xl font-black text-gray-800">{stats.avaliacoes}</div>
                <div className="text-sm text-gray-500">Avaliações</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-3xl font-black text-gray-800">
                  {stats.media_notas > 0 ? stats.media_notas.toFixed(1) : "-"}
                </div>
                <div className="text-sm text-gray-500">Nota Média</div>
              </div>
            </div>

            {/* Informações do Perfil */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Seu Perfil</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Categoria</p>
                  <p className="font-medium text-gray-800">{prestador.categoria}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cidade</p>
                  <p className="font-medium text-gray-800">{prestador.cidade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">WhatsApp</p>
                  <p className="font-medium text-gray-800">{prestador.whatsapp}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{prestador.email}</p>
                </div>
              </div>
              
              {/* Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-3">Seus destaques</p>
                <div className="flex flex-wrap gap-2">
                  {prestador.verificado && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verificado
                    </span>
                  )}
                  {prestador.emergencia24h && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                      ⚡ Emergência 24h
                    </span>
                  )}
                  {prestador.delivery && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      🚚 Delivery
                    </span>
                  )}
                  {prestador.agendamento_online && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      📅 Agendamento Online
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Últimas Avaliações */}
            {avaliacoes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Últimas Avaliações</h2>
                  <button
                    onClick={() => setActiveTab("avaliacoes")}
                    className="text-[#20B2AA] font-medium text-sm hover:underline"
                  >
                    Ver todas →
                  </button>
                </div>
                
                <div className="space-y-4">
                  {avaliacoes.slice(0, 3).map((avaliacao) => (
                    <div key={avaliacao.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{avaliacao.autor_nome}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < avaliacao.nota ? "⭐" : "☆"}</span>
                          ))}
                        </div>
                      </div>
                      {avaliacao.comentario && (
                        <p className="text-gray-600 text-sm">{avaliacao.comentario}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Perfil</h2>
            <p className="text-gray-500 mb-4">
              Para editar seu perfil, entre em contato conosco ou aguarde a liberação da funcionalidade.
            </p>
            <a
              href="mailto:contato@sospet.com.br"
              className="inline-block px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all"
            >
              📧 Solicitar Alteração
            </a>
          </div>
        )}

        {activeTab === "avaliacoes" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Todas as Avaliações ({avaliacoes.length})
            </h2>
            
            {avaliacoes.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl block mb-4">⭐</span>
                <p className="text-gray-500">Você ainda não recebeu avaliações</p>
                <p className="text-gray-400 text-sm mt-2">
                  Compartilhe sua página para receber mais clientes!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold">
                          {avaliacao.autor_nome?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{avaliacao.autor_nome}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(avaliacao.created_at).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">{i < avaliacao.nota ? "⭐" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    {avaliacao.comentario && (
                      <p className="text-gray-600">{avaliacao.comentario}</p>
                    )}
                    {avaliacao.servico_utilizado && (
                      <p className="text-sm text-gray-400 mt-2">
                        Serviço: {avaliacao.servico_utilizado}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "configuracoes" && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações</h2>
            
            <div className="space-y-6">
              {/* Upgrade para Premium */}
              <div className="border-2 border-[#20B2AA] rounded-2xl p-6 bg-[#20B2AA]/5">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">🚀</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      Upgrade para Premium
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Destaque seu negócio, apareça primeiro nas buscas e receba o selo de verificado.
                    </p>
                    <button className="px-6 py-2 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all">
                      Em breve
                    </button>
                  </div>
                </div>
              </div>

              {/* Notificações */}
              <div className="border border-gray-100 rounded-2xl p-6">
                <h3 className="font-bold text-gray-800 mb-4">Notificações</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-600">Receber alertas de novas avaliações</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#20B2AA]" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-600">Novidades e dicas do SOS Pet</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#20B2AA]" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
