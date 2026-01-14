"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/**
 * Hook para animação de contagem (count-up effect)
 */
function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || end === 0) {
      if (start) setCount(end);
      return;
    }
    
    let startTime = null;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * (end - startValue) + startValue);
      setCount(currentValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

/**
 * Componente de estatística individual com animação
 */
function StatCard({ value, label, suffix = "+", isVisible }) {
  const animatedValue = useCountUp(value, 2000, isVisible);
  
  return (
    <div>
      <div className="text-4xl md:text-5xl font-black mb-2">
        {animatedValue.toLocaleString("pt-BR")}{suffix}
      </div>
      <div className="text-base md:text-lg font-semibold opacity-90">{label}</div>
    </div>
  );
}

/**
 * Componente Ticker de Avisos
 */
function AnnouncementTicker({ avisos }) {
  if (!avisos || avisos.length === 0) return null;

  return (
    <div className="bg-[#FF6B35] text-white py-2 overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...avisos, ...avisos].map((aviso, index) => (
          <span key={index} className="mx-8 flex items-center gap-2">
            <span>{aviso.emoji || "📢"}</span>
            <span className="font-medium">{aviso.mensagem}</span>
            {aviso.link && (
              <Link href={aviso.link} className="underline ml-2 hover:text-white/80">
                Saiba mais →
              </Link>
            )}
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    prestadores: 0,
    usuarios: 0,
    petsReunidos: 0,
    avaliacoes: 0,
  });
  const [avisos, setAvisos] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Intersection Observer para animar estatísticas quando visíveis
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  // Buscar estatísticas reais do banco
  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: prestadoresCount } = await supabase
          .from("prestadores")
          .select("*", { count: "exact", head: true })
          .eq("status", "aprovado");

        const { count: petsCount } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true });

        const { count: reunidosCount } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
          .eq("status", "encontrado");

        let avistamentosCount = 0;
        try {
          const { count } = await supabase
            .from("avistamentos")
            .select("*", { count: "exact", head: true });
          avistamentosCount = count || 0;
        } catch {
          avistamentosCount = 0;
        }

        setStats({
          prestadores: prestadoresCount || 0,
          usuarios: petsCount || 0,
          petsReunidos: reunidosCount || 0,
          avaliacoes: avistamentosCount || 0,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }

    fetchStats();
  }, []);

  // Buscar avisos ativos
  useEffect(() => {
    async function fetchAvisos() {
      try {
        const { data } = await supabase
          .from("avisos")
          .select("*")
          .eq("ativo", true)
          .order("created_at", { ascending: false })
          .limit(5);
        
        if (data && data.length > 0) {
          setAvisos(data);
        } else {
          // Avisos padrão se não houver no banco
          setAvisos([
            { emoji: "🐾", mensagem: "Bem-vindo ao SOS Pet! Ajudando pets na Baixada Santista" },
            { emoji: "🚨", mensagem: "Perdeu seu pet? Cadastre agora e receba ajuda da comunidade", link: "/achados-e-perdidos/cadastrar" },
            { emoji: "🤝", mensagem: "ONGs: tornem-se parceiros AUmigos!", link: "/parcerias" },
          ]);
        }
      } catch {
        setAvisos([
          { emoji: "🐾", mensagem: "Bem-vindo ao SOS Pet! Ajudando pets na Baixada Santista" },
        ]);
      }
    }

    fetchAvisos();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/prestadores?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  /**
   * Badges funcionais - cada um filtra prestadores
   */
  const heroBadges = [
    {
      emoji: "⚡",
      label: "Emergência 24h",
      href: "/prestadores?emergencia24h=true",
      color: "bg-red-500/20 border-red-400/50",
    },
    {
      emoji: "🚚",
      label: "Delivery Disponível",
      href: "/prestadores?delivery=true",
      color: "bg-blue-500/20 border-blue-400/50",
    },
    {
      emoji: "✓",
      label: "Profissionais Verificados",
      href: "/prestadores?verificado=true",
      color: "bg-green-500/20 border-green-400/50",
    },
    {
      emoji: "📅",
      label: "Agendamento Online",
      href: "/prestadores?agendamento=true",
      color: "bg-purple-500/20 border-purple-400/50",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      
      {/* Ticker de Avisos */}
      <div className="pt-20">
        <AnnouncementTicker avisos={avisos} />
      </div>
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] min-h-[550px] flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center py-12">
          
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl md:text-6xl">🐾</span>
              <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
                SOS Pet
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white font-semibold opacity-95">
              Encontre os melhores serviços para seu pet na Baixada Santista
            </p>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl overflow-hidden">
              <div className="flex items-center p-2 pl-6">
                <span className="text-2xl mr-3 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por veterinário, pet shop, hotel..."
                  className="flex-1 text-base md:text-lg outline-none text-gray-700 bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-6 md:px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>

          {/* Badges Funcionais */}
          <div className="flex flex-wrap justify-center gap-3">
            {heroBadges.map((badge, index) => (
              <Link
                key={index}
                href={badge.href}
                className={`${badge.color} backdrop-blur-sm border-2 px-5 py-2.5 rounded-full text-white font-bold text-sm hover:scale-105 transition-all hover:shadow-lg`}
              >
                {badge.emoji} {badge.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA BAIXADA SANTISTA */}
      <section className="py-8 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🗺️</span>
              <div>
                <h2 className="font-bold text-gray-800">Cobertura: Baixada Santista</h2>
                <p className="text-sm text-gray-500">
                  Santos • Guarujá • Praia Grande • São Vicente • Cubatão • Bertioga • Mongaguá • Itanhaém • Peruíbe
                </p>
              </div>
            </div>
            <Link 
              href="/achados-e-perdidos"
              className="text-[#20B2AA] hover:text-[#1a9e97] font-bold text-sm flex items-center gap-1"
            >
              Ver pets da região →
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-gray-800">
            O que você procura?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <Link href="/prestadores?category=Veterinario" className="bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] border-2 border-[#20B2AA]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🏥</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#20B2AA]">Veterinários</h3>
              <p className="text-gray-600 text-sm">Clínicas e profissionais</p>
            </Link>

            <Link href="/prestadores?category=Pet Shop" className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border-2 border-[#FF6B35]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🛍️</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#FF6B35]">Pet Shops</h3>
              <p className="text-gray-600 text-sm">Produtos e acessórios</p>
            </Link>

            <Link href="/prestadores?category=Hotel" className="bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] border-2 border-[#20B2AA]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🏨</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#20B2AA]">Hotéis Pet</h3>
              <p className="text-gray-600 text-sm">Hospedagem segura</p>
            </Link>

            <Link href="/prestadores?category=Banho e Tosa" className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border-2 border-[#FF6B35]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">✂️</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#FF6B35]">Banho e Tosa</h3>
              <p className="text-gray-600 text-sm">Estética e higiene</p>
            </Link>
          </div>
        </div>
      </section>

      {/* AÇÕES RÁPIDAS */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Achados e Perdidos */}
            <Link 
              href="/achados-e-perdidos"
              className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🔍</span>
                <div>
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-red-600">Achados e Perdidos</h3>
                  <p className="text-sm text-gray-500">Toda Baixada Santista</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Perdeu ou encontrou um pet? A comunidade pode ajudar!
              </p>
              <span className="text-red-600 font-bold text-sm">Ver pets →</span>
            </Link>

            {/* Emergência */}
            <Link 
              href="/prestadores?emergencia24h=true"
              className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🚨</span>
                <div>
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-orange-600">Emergência 24h</h3>
                  <p className="text-sm text-gray-500">Atendimento urgente</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Clínicas veterinárias com atendimento 24 horas
              </p>
              <span className="text-orange-600 font-bold text-sm">Ver clínicas →</span>
            </Link>

            {/* Parcerias */}
            <Link 
              href="/parcerias"
              className="bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] border-2 border-[#20B2AA]/30 rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">🤝</span>
                <div>
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-[#20B2AA]">Seja Parceiro</h3>
                  <p className="text-sm text-gray-500">ONGs e Protetores</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Junte-se ao SOS Pet e ajude a salvar vidas
              </p>
              <span className="text-[#20B2AA] font-bold text-sm">Saiba mais →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PRESTADORES DESTAQUE */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-800">Prestadores em Destaque</h2>
              <p className="text-lg md:text-xl text-gray-600">Os melhores avaliados da região</p>
            </div>
            <Link href="/prestadores" className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg">
              Ver Todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🏥</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full">⚡ 24h</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Clínica Veterinária Guarujá</h3>
              <p className="text-sm text-gray-500 mb-3">Veterinário • Guarujá</p>
              <p className="text-gray-600 text-sm mb-4">Clínica completa com mais de 12 anos de experiência</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">5.0</span>
                <span className="text-gray-400 text-sm">(127)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🛍️</div>
              <div className="flex gap-2 mb-4">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">🚚 Delivery</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Pet Shop Praia Grande</h3>
              <p className="text-sm text-gray-500 mb-3">Pet Shop • Praia Grande</p>
              <p className="text-gray-600 text-sm mb-4">Produtos premium e acessórios para todos os pets</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">4.9</span>
                <span className="text-gray-400 text-sm">(89)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🏨</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                <span className="bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full">📅 Agenda</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Hotel Pet Paraíso</h3>
              <p className="text-sm text-gray-500 mb-3">Hotel • Santos</p>
              <p className="text-gray-600 text-sm mb-4">Hospedagem 5 estrelas com área de recreação</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">4.8</span>
                <span className="text-gray-400 text-sm">(156)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS COM DADOS REAIS */}
      <section 
        ref={statsRef}
        className="py-16 px-4 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Fazendo a diferença juntos 🐾
            </h2>
            <p className="text-lg opacity-90">
              Cada número representa uma história de amor e cuidado
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard 
              value={stats.prestadores} 
              label="Prestadores Parceiros" 
              isVisible={statsVisible}
            />
            <StatCard 
              value={stats.usuarios} 
              label="Pets Cadastrados" 
              isVisible={statsVisible}
            />
            <StatCard 
              value={stats.petsReunidos} 
              label="Reencontros Felizes" 
              isVisible={statsVisible}
            />
            <StatCard 
              value={stats.avaliacoes} 
              label="Avistamentos Reportados" 
              isVisible={statsVisible}
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              É um Prestador de Serviços?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95">
              Cadastre-se gratuitamente e conecte-se com milhares de tutores
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">📈</div>
                <div className="font-bold">Mais Visibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">💰</div>
                <div className="font-bold">100% Gratuito</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">⭐</div>
                <div className="font-bold">Reputação Online</div>
              </div>
            </div>

            <Link href="/cadastro" className="inline-block bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-12 py-5 rounded-xl font-black text-lg md:text-xl hover:scale-105 transition-all shadow-lg">
              Cadastrar Meu Negócio →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
