"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * SOS Pet - Landing Page Premium Dark Theme
 * 
 * Design inspirado em interfaces tech/SaaS modernas com:
 * - Tema escuro com gradientes
 * - Efeitos glow/neon
 * - Cards com bordas coloridas
 * - Animações suaves
 * - Mockup de dispositivo
 * 
 * @returns {JSX.Element}
 */

// ===========================================
// HOOK: Contador animado
// ===========================================
function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || end === 0) {
      if (start) setCount(end);
      return;
    }
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// ===========================================
// COMPONENTE: Card de Estatística
// ===========================================
function StatCard({ value, label, icon, isVisible }) {
  const animatedValue = useCountUp(value, 2000, isVisible);
  
  return (
    <div className="text-center group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {animatedValue.toLocaleString("pt-BR")}+
      </div>
      <div className="text-gray-400 font-medium">{label}</div>
    </div>
  );
}

// ===========================================
// COMPONENTE: Card de Funcionalidade
// ===========================================
function FeatureCard({ icon, title, description, color, delay }) {
  const colorClasses = {
    orange: "border-orange-500/50 hover:border-orange-500 hover:shadow-orange-500/20",
    cyan: "border-cyan-500/50 hover:border-cyan-500 hover:shadow-cyan-500/20",
    purple: "border-purple-500/50 hover:border-purple-500 hover:shadow-purple-500/20",
    pink: "border-pink-500/50 hover:border-pink-500 hover:shadow-pink-500/20",
  };

  const glowClasses = {
    orange: "bg-orange-500/10",
    cyan: "bg-cyan-500/10",
    purple: "bg-purple-500/10",
    pink: "bg-pink-500/10",
  };

  return (
    <div 
      className={`relative bg-slate-800/50 backdrop-blur-sm border-2 ${colorClasses[color]} rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeInUp`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 ${glowClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ===========================================
// COMPONENTE: Card de Depoimento
// ===========================================
function TestimonialCard({ name, role, text, image, delay }) {
  return (
    <div 
      className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-gray-300 italic mb-4 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl">
            {image}
          </div>
        </div>
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// COMPONENTE: Badge de Filtro
// ===========================================
function FilterBadge({ icon, label, href, color }) {
  const colorClasses = {
    red: "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500",
    blue: "bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30 hover:border-blue-500",
    green: "bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 hover:border-green-500",
    purple: "bg-purple-500/20 border-purple-500/50 text-purple-400 hover:bg-purple-500/30 hover:border-purple-500",
  };

  return (
    <Link
      href={href}
      className={`${colorClasses[color]} border px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

// ===========================================
// COMPONENTE: Card de Categoria
// ===========================================
function CategoryCard({ icon, title, description, href, color, delay }) {
  const colorClasses = {
    cyan: "from-cyan-500/20 to-transparent border-cyan-500/30 hover:border-cyan-500",
    orange: "from-orange-500/20 to-transparent border-orange-500/30 hover:border-orange-500",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 hover:border-purple-500",
    pink: "from-pink-500/20 to-transparent border-pink-500/30 hover:border-pink-500",
  };

  return (
    <Link
      href={href}
      className={`block bg-gradient-to-b ${colorClasses[color]} border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeInUp group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}

// ===========================================
// COMPONENTE: Cidade Badge
// ===========================================
function CityBadge({ name, emoji }) {
  return (
    <span className="bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded-full text-sm text-gray-300 flex items-center gap-2 hover:border-cyan-500/50 transition-colors cursor-default">
      <span>{emoji}</span>
      <span>{name}</span>
    </span>
  );
}

// ===========================================
// PÁGINA PRINCIPAL
// ===========================================
export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    prestadores: 0,
    pets: 0,
    reunidos: 0,
    avistamentos: 0,
  });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  // Observer para animação de estatísticas
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  // Buscar estatísticas do banco
  useEffect(() => {
    async function fetchStats() {
      try {
        const [prestadores, pets, reunidos, avistamentos] = await Promise.all([
          supabase.from("prestadores").select("*", { count: "exact", head: true }).eq("status", "aprovado"),
          supabase.from("pets").select("*", { count: "exact", head: true }),
          supabase.from("pets").select("*", { count: "exact", head: true }).eq("status", "encontrado"),
          supabase.from("avistamentos").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          prestadores: prestadores.count || 0,
          pets: pets.count || 0,
          reunidos: reunidos.count || 0,
          avistamentos: avistamentos.count || 0,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    }
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/prestadores?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 overflow-hidden">
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.6); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .bg-gradient-animated {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Animated Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,200 Q400,100 800,200 T1600,200" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="animate-pulse" />
            <path d="M0,400 Q400,300 800,400 T1600,400" stroke="url(#line-gradient)" strokeWidth="1" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 rounded-full px-4 py-2 mb-6 animate-fadeInUp">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-300">Plataforma 100% Gratuita</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-cyan-400 bg-gradient-animated">
                  SOS Pet
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-gray-200">
                  O Futuro do Cuidado
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Inteligente
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                Alta Performance e Tecnologia unidas para a saúde e felicidade do seu pet na 
                <span className="text-cyan-400 font-semibold"> Baixada Santista</span>.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <div className="relative max-w-xl mx-auto lg:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-30"></div>
                  <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 flex items-center">
                    <span className="text-2xl ml-4 text-gray-500">🔍</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar veterinário, pet shop, hotel..."
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 animate-pulse-glow"
                    >
                      Buscar
                    </button>
                  </div>
                </div>
              </form>

              {/* Filter Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                <FilterBadge icon="⚡" label="Emergência 24h" href="/prestadores?emergencia24h=true" color="red" />
                <FilterBadge icon="🚚" label="Delivery" href="/prestadores?delivery=true" color="blue" />
                <FilterBadge icon="✓" label="Verificados" href="/prestadores?verificado=true" color="green" />
                <FilterBadge icon="📅" label="Agendamento" href="/prestadores?agendamento=true" color="purple" />
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center animate-fadeInUp" style={{ animationDelay: '500ms' }}>
              {/* Glow Effect Behind Phone */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute w-48 h-48 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-10 right-10 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐕</span>
                  <div>
                    <p className="text-white font-bold text-sm">Max Encontrado!</p>
                    <p className="text-green-400 text-xs">Há 2 min</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-20 left-0 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-white font-bold text-sm">Novo Avistamento</p>
                    <p className="text-cyan-400 text-xs">Pitangueiras, Guarujá</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 right-0 bg-slate-800/80 backdrop-blur-sm border border-orange-500/50 rounded-xl p-3 animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-white font-bold text-sm">5.0</p>
                    <p className="text-gray-400 text-xs">127 avaliações</p>
                  </div>
                </div>
              </div>
              
              {/* Phone Mockup */}
              <div className="relative z-10">
                <div className="relative w-64 md:w-72">
                  {/* Phone Frame */}
                  <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-[3rem] p-2 shadow-2xl">
                    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden">
                      {/* Notch */}
                      <div className="h-6 bg-slate-900 flex justify-center items-end pb-1">
                        <div className="w-20 h-4 bg-slate-800 rounded-full"></div>
                      </div>
                      {/* Screen Content */}
                      <div className="h-[400px] md:h-[450px] bg-gradient-to-b from-slate-800 to-slate-900 p-4">
                        {/* App Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🐾</span>
                            <span className="text-white font-bold">SOS Pet</span>
                          </div>
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🔔</span>
                          </div>
                        </div>
                        
                        {/* Search */}
                        <div className="bg-slate-700/50 rounded-xl p-3 mb-4 flex items-center gap-2">
                          <span className="text-gray-500">🔍</span>
                          <span className="text-gray-500 text-sm">Buscar serviços...</span>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {['🏥', '🛍️', '✂️', '🏨'].map((icon, i) => (
                            <div key={i} className="bg-slate-700/50 rounded-xl p-3 flex items-center justify-center">
                              <span className="text-xl">{icon}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Alert Card */}
                        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-3 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span>🚨</span>
                            <span className="text-white font-bold text-sm">Alerta Ativo</span>
                          </div>
                          <p className="text-gray-400 text-xs">Luna - Labrador perdida em Santos</p>
                        </div>
                        
                        {/* Featured */}
                        <div className="bg-slate-700/30 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                              <span className="text-2xl">🏥</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-bold text-sm">Clínica VetLife</p>
                              <p className="text-gray-500 text-xs">24h • 2.5km</p>
                            </div>
                            <div className="text-yellow-500 text-sm">⭐ 4.9</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glow Ring */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-[4rem] opacity-20 blur-xl -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          TECNOLOGIA QUE TRANSFORMA
          ================================================ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Tecnologia que <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Transforma</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Funcionalidades inteligentes para conectar tutores, prestadores e protetores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="📊"
              title="Saúde Preditiva"
              description="Acompanhe o histórico de saúde do seu pet e receba alertas importantes sobre vacinas e consultas."
              color="orange"
              delay={0}
            />
            <FeatureCard
              icon="🤖"
              title="Chat IA 24/7"
              description="Tire dúvidas sobre cuidados com pets a qualquer hora com nossa assistente inteligente."
              color="cyan"
              delay={100}
            />
            <FeatureCard
              icon="🗺️"
              title="Mapa em Tempo Real"
              description="Visualize avistamentos, clínicas de emergência e serviços próximos no mapa interativo."
              color="purple"
              delay={200}
            />
            <FeatureCard
              icon="⚙️"
              title="Gestão Automatizada"
              description="Para prestadores: gerencie agendamentos, clientes e avaliações em um só lugar."
              color="pink"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ================================================
          PARA TUTORES / PARA NEGÓCIOS
          ================================================ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Para Tutores */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🐕</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Para o Tutor</h3>
                  <p className="text-gray-400 text-sm">Tenha tudo que seu pet precisa</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                  <span className="text-2xl mb-2 block">📋</span>
                  <h4 className="font-bold text-white mb-1">Histórico Completo</h4>
                  <p className="text-gray-500 text-xs">Consultas, vacinas e exames</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                  <span className="text-2xl mb-2 block">🔔</span>
                  <h4 className="font-bold text-white mb-1">Lembretes Inteligentes</h4>
                  <p className="text-gray-500 text-xs">Nunca mais perca uma vacina</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                  <span className="text-2xl mb-2 block">📍</span>
                  <h4 className="font-bold text-white mb-1">Conexão Direta</h4>
                  <p className="text-gray-500 text-xs">Fale direto com veterinários</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                  <span className="text-2xl mb-2 block">🆘</span>
                  <h4 className="font-bold text-white mb-1">SOS Perdidos</h4>
                  <p className="text-gray-500 text-xs">Alerte toda a comunidade</p>
                </div>
              </div>
              
              <Link
                href="/registro"
                className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-4 rounded-xl font-bold text-center block transition-all hover:scale-[1.02]"
              >
                Criar Conta Grátis →
              </Link>
            </div>

            {/* Para Negócios */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Para seu Negócio</h3>
                  <p className="text-gray-400 text-sm">Simplifique e atraia mais clientes</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-orange-500/50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Agenda Inteligente</h4>
                    <p className="text-gray-500 text-sm">Receba agendamentos online automaticamente</p>
                  </div>
                  <span className="text-green-500 ml-auto">✓</span>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-orange-500/50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">📈</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Painel Completo</h4>
                    <p className="text-gray-500 text-sm">Estatísticas de visualizações e conversões</p>
                  </div>
                  <span className="text-green-500 ml-auto">✓</span>
                </div>
                
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-orange-500/50 transition-colors flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Avaliações e Reviews</h4>
                    <p className="text-gray-500 text-sm">Construa sua reputação online</p>
                  </div>
                  <span className="text-green-500 ml-auto">✓</span>
                </div>
              </div>
              
              <Link
                href="/cadastro"
                className="mt-6 w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-center block transition-all hover:scale-[1.02]"
              >
                Cadastrar Meu Negócio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          CATEGORIAS DE SERVIÇO
          ================================================ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              O que você <span className="text-orange-400">procura</span>?
            </h2>
            <p className="text-gray-400 text-lg">Encontre os melhores serviços da Baixada Santista</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard icon="🏥" title="Veterinários" description="Clínicas e profissionais" href="/prestadores?categoria=Veterinario" color="cyan" delay={0} />
            <CategoryCard icon="🛍️" title="Pet Shops" description="Produtos e acessórios" href="/prestadores?categoria=Pet Shop" color="orange" delay={100} />
            <CategoryCard icon="✂️" title="Banho e Tosa" description="Estética e higiene" href="/prestadores?categoria=Banho e Tosa" color="purple" delay={200} />
            <CategoryCard icon="🏨" title="Hotéis Pet" description="Hospedagem segura" href="/prestadores?categoria=Hotel" color="pink" delay={300} />
          </div>
        </div>
      </section>

      {/* ================================================
          COBERTURA - MAPA DA BAIXADA SANTISTA
          ================================================ */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Map Visual */}
              <div className="relative">
                <div className="aspect-square bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 relative overflow-hidden">
                  {/* Stylized Map Background */}
                  <div className="absolute inset-0 opacity-30">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                      {/* Coast line */}
                      <path d="M50,350 Q100,300 150,320 T250,280 T350,320" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.5" />
                      <path d="M30,380 Q100,340 180,360 T300,320 T400,350" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.3" />
                    </svg>
                  </div>
                  
                  {/* City Markers */}
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { name: 'Santos', x: '40%', y: '30%' },
                        { name: 'Guarujá', x: '60%', y: '25%' },
                        { name: 'P. Grande', x: '30%', y: '50%' },
                        { name: 'S. Vicente', x: '35%', y: '40%' },
                        { name: 'Cubatão', x: '50%', y: '20%' },
                        { name: 'Bertioga', x: '75%', y: '15%' },
                      ].map((city, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
                          <span className="text-xs text-gray-400 mt-1">{city.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 bg-slate-900/80 rounded-lg px-3 py-1 border border-slate-700">
                    <span className="text-cyan-400 text-xs font-bold">9 Cidades</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Cobertura <span className="text-cyan-400">Baixada Santista</span>
                </h2>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Não se preocupe! O SOS Pet cobre toda a região da Baixada Santista. 
                  Encontre serviços e ajude pets em qualquer uma das 9 cidades.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  <CityBadge name="Santos" emoji="⚓" />
                  <CityBadge name="Guarujá" emoji="🏖️" />
                  <CityBadge name="Praia Grande" emoji="🌊" />
                  <CityBadge name="São Vicente" emoji="🏛️" />
                  <CityBadge name="Cubatão" emoji="🏭" />
                  <CityBadge name="Bertioga" emoji="🌴" />
                  <CityBadge name="Mongaguá" emoji="🐟" />
                  <CityBadge name="Itanhaém" emoji="🏄" />
                  <CityBadge name="Peruíbe" emoji="🦜" />
                </div>
                
                <Link
                  href="/achados-e-perdidos"
                  className="inline-flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <span>🗺️</span>
                  <span>Ver Mapa de Pets</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          ESTATÍSTICAS
          ================================================ */}
      <section ref={statsRef} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Fazendo a diferença <span className="text-orange-400">juntos</span> 🐾
            </h2>
            <p className="text-gray-400">Cada número representa uma história de amor e cuidado</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={stats.prestadores} label="Prestadores Parceiros" icon="🏥" isVisible={statsVisible} />
            <StatCard value={stats.pets} label="Pets Cadastrados" icon="🐾" isVisible={statsVisible} />
            <StatCard value={stats.reunidos} label="Reencontros Felizes" icon="💚" isVisible={statsVisible} />
            <StatCard value={stats.avistamentos} label="Avistamentos" icon="👀" isVisible={statsVisible} />
          </div>
        </div>
      </section>

      {/* ================================================
          DEPOIMENTOS
          ================================================ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Depoimentos <span className="text-purple-400">Reais</span>
            </h2>
            <p className="text-gray-400">Veja o que nossa comunidade está dizendo</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Maria Santos"
              role="Tutora • Guarujá"
              text="Encontrei minha Luna em 3 dias graças ao SOS Pet! A comunidade é incrível e o mapa de avistamentos ajudou muito."
              image="👩"
              delay={0}
            />
            <TestimonialCard
              name="Dr. Carlos Mendes"
              role="Veterinário • Santos"
              text="Desde que cadastrei minha clínica, recebi muitos clientes novos. A plataforma é muito bem feita e profissional."
              image="👨‍⚕️"
              delay={100}
            />
            <TestimonialCard
              name="Ana Proteção Animal"
              role="ONG • Praia Grande"
              text="O SOS Pet nos ajuda a divulgar nossos animais para adoção. Já conseguimos lares para mais de 50 pets!"
              image="👩‍🦰"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ================================================
          CTA FINAL
          ================================================ */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 blur-xl"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de tutores e prestadores que já fazem parte da maior comunidade pet da Baixada Santista.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/registro"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 animate-pulse-glow"
                >
                  🐾 Criar Conta Grátis
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                >
                  💼 Sou Profissional
                </Link>
              </div>
              
              <p className="mt-6 text-gray-500 text-sm">
                ✓ 100% Gratuito • ✓ Sem cartão de crédito • ✓ Cadastro em 2 minutos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          FUNCIONALIDADES RÁPIDAS (Como nas imagens)
          ================================================ */}
      <section className="py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Funcionalidades que fazem a diferença</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">App PWA</p>
                <p className="text-gray-500 text-xs">Instale no celular</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔔</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Alertas em Tempo Real</p>
                <p className="text-gray-500 text-xs">Notificações instantâneas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">🗺️</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Mapa Interativo</p>
                <p className="text-gray-500 text-xs">Localize serviços e pets</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Contato Direto</p>
                <p className="text-gray-500 text-xs">WhatsApp integrado</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
