"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  PainPointCard, 
  StatCard, 
  TestimonialCard, 
  CompareItem, 
  PhoneMockup 
} from "./components/LandingComponents";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ prestadores: 0, pets: 0, reunidos: 0, avistamentos: 0 });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !statsVisible) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

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
      } catch (error) { console.error("Erro:", error); }
    }
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) window.location.href = `/prestadores?search=${encodeURIComponent(searchQuery)}`;
  };

  const painPoints = [
    { icon: "💉", question: "Perdeu a carteira de vacinas?", solution: "Histórico digital completo, acessível a qualquer momento." },
    { icon: "📅", question: "Esquece compromissos do pet?", solution: "Lembretes automáticos para vacinas, vermífugos e consultas." },
    { icon: "🔍", question: "Pet fugiu e não sabe o que fazer?", solution: "Alerta instantâneo para toda a comunidade com mapa em tempo real." },
    { icon: "🏥", question: "Precisa de vet às 3h da manhã?", solution: "Acesso rápido a clínicas 24h na sua região." }
  ];

  const cities = [
    { name: "Santos", emoji: "⚓" }, { name: "Guarujá", emoji: "🏖️" }, { name: "Praia Grande", emoji: "🌊" },
    { name: "São Vicente", emoji: "🏛️" }, { name: "Cubatão", emoji: "🏭" }, { name: "Bertioga", emoji: "🌴" },
    { name: "Mongaguá", emoji: "🐟" }, { name: "Itanhaém", emoji: "🏄" }, { name: "Peruíbe", emoji: "🦜" }
  ];

  return (
    <main className="min-h-screen bg-slate-950 overflow-hidden">
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slower { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 25% { transform: scale(1.1); } 50% { transform: scale(1); } 75% { transform: scale(1.1); } }
        @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slower { animation: spin-slower 30s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
        .animate-heartbeat { animation: heartbeat 1s ease-in-out infinite; }
        .animate-scan { animation: scan 2s ease-in-out infinite; }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full"><defs><pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="#06b6d4" /><path d="M50 0 V30 M50 70 V100 M0 50 H30 M70 50 H100" stroke="#06b6d4" strokeWidth="0.5" fill="none" /></pattern></defs><rect width="100%" height="100%" fill="url(#circuit)" /></svg>
          </div>
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-full px-4 py-2 mb-6 animate-fadeInUp">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-300">+500 famílias reunidas na Baixada Santista</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight animate-fadeInUp" style={{ animationDelay: '100ms' }}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">SOS Pet</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-2 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
                <span className="text-orange-400 font-semibold">Conectando</span> quem ama
              </p>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                com <span className="text-cyan-400 font-semibold">quem cuida</span>.
              </p>

              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0 animate-fadeInUp" style={{ animationDelay: '250ms' }}>
                A plataforma que une tecnologia de ponta ao amor pelos pets. Encontre serviços, reúna famílias e cuide de quem você ama.
              </p>

              <form onSubmit={handleSearch} className="mb-6 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
                <div className="relative max-w-lg mx-auto lg:mx-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-2 flex items-center">
                    <span className="text-xl ml-4 text-gray-500">🔍</span>
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar veterinário, pet shop..." className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none text-base" />
                    <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95">Buscar</button>
                  </div>
                </div>
              </form>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fadeInUp" style={{ animationDelay: '350ms' }}>
                <Link href="/achados-e-perdidos" className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105">🚨 Pet Perdido</Link>
                <Link href="/prestadores?emergencia24h=true" className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105">🏥 Emergência 24h</Link>
                <Link href="/prestadores" className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600 text-gray-300 px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105">🔍 Ver Serviços</Link>
              </div>
            </div>

            <div className="relative flex justify-center animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]"></div>
              </div>
              
              <div className="absolute top-5 right-5 md:top-10 md:right-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-3 animate-float shadow-xl z-20">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><span className="text-xl">🐕</span></div>
                  <div><p className="text-white font-bold text-sm">Max Encontrado!</p><p className="text-green-400 text-xs">Família reunida ❤️</p></div>
                </div>
              </div>
              
              <div className="absolute bottom-20 left-0 bg-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 animate-float shadow-xl z-20" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center"><span className="text-xl">📍</span></div>
                  <div><p className="text-white font-bold text-sm">Novo Avistamento</p><p className="text-cyan-400 text-xs">Pitangueiras, Guarujá</p></div>
                </div>
              </div>
              
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Qual é a sua <span className="text-orange-400">dor</span> hoje?</h2>
            <p className="text-gray-400">Passe o mouse para ver como o SOS Pet resolve</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((pain, i) => <PainPointCard key={i} {...pain} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Evolua o cuidado com seu <span className="text-cyan-400">pet</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-red-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center"><span className="text-2xl">📋</span></div>
                <div><h3 className="text-xl font-bold text-white">Método Tradicional</h3><p className="text-red-400 text-sm">Desorganizado</p></div>
              </div>
              <div className="space-y-3">
                <CompareItem icon="❌" text="Carteira de vacina que some" type="old" />
                <CompareItem icon="❌" text="Esquece datas importantes" type="old" />
                <CompareItem icon="❌" text="Pet foge sem saber o que fazer" type="old" />
                <CompareItem icon="❌" text="Liga para 10 vets de madrugada" type="old" />
              </div>
            </div>
            <div className="bg-slate-900/50 border border-green-500/20 rounded-3xl p-8 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-3xl blur-xl -z-10"></div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-green-500/30 rounded-xl flex items-center justify-center"><span className="text-2xl">🐾</span></div>
                <div><h3 className="text-xl font-bold text-white">Com SOS Pet</h3><p className="text-green-400 text-sm">Tudo na palma da mão</p></div>
              </div>
              <div className="space-y-3">
                <CompareItem icon="✓" text="Histórico digital completo" type="new" />
                <CompareItem icon="✓" text="Lembretes automáticos" type="new" />
                <CompareItem icon="✓" text="Alerta comunidade em segundos" type="new" />
                <CompareItem icon="✓" text="Clínicas 24h com um clique" type="new" />
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/registro" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">Começar Gratuitamente →</Link>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-black text-white">Feito para <span className="text-orange-400">você</span></h2></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center"><span className="text-4xl">🐕</span></div>
                <div><h3 className="text-2xl font-bold text-white">Sou Tutor</h3><p className="text-gray-400">Cuide do seu melhor amigo</p></div>
              </div>
              <ul className="space-y-3 mb-8">
                {["Perfil completo com histórico de saúde", "Alertas de vacinas", "Serviços avaliados", "Busca de pets perdidos"].map((t, i) => <li key={i} className="flex items-start gap-3 text-gray-300"><span className="text-cyan-400">✓</span>{t}</li>)}
              </ul>
              <Link href="/registro" className="block w-full text-center bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-xl font-bold transition-all">Criar Conta Grátis</Link>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center"><span className="text-4xl">💼</span></div>
                <div><h3 className="text-2xl font-bold text-white">Sou Profissional</h3><p className="text-gray-400">Atraia mais clientes</p></div>
              </div>
              <ul className="space-y-3 mb-8">
                {["Perfil profissional", "Milhares de tutores", "Agendamentos online", "Dashboard de métricas"].map((t, i) => <li key={i} className="flex items-start gap-3 text-gray-300"><span className="text-orange-400">✓</span>{t}</li>)}
              </ul>
              <Link href="/cadastro" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all">Cadastrar Negócio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Cobertura <span className="text-cyan-400">Baixada Santista</span></h2>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {cities.map((c) => <span key={c.name} className="bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-full text-gray-300 text-sm flex items-center gap-2"><span>{c.emoji}</span>{c.name}</span>)}
            </div>
            <div className="text-center">
              <Link href="/achados-e-perdidos" className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-xl font-semibold">🗺️ Ver Mapa de Pets</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-orange-500/5"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={stats.prestadores || 25} label="Prestadores" icon="🏥" isVisible={statsVisible} />
            <StatCard value={stats.pets || 150} label="Pets Cadastrados" icon="🐾" isVisible={statsVisible} />
            <StatCard value={stats.reunidos || 45} label="Famílias Reunidas" icon="💚" isVisible={statsVisible} />
            <StatCard value={stats.avistamentos || 200} label="Avistamentos" icon="👀" isVisible={statsVisible} />
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-black text-white">O que dizem sobre <span className="text-orange-400">nós</span></h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard name="Maria Santos" role="Tutora • Guarujá" text="Encontrei minha Luna em 3 dias! O mapa foi essencial." image="👩" rating={5} delay={0} />
            <TestimonialCard name="Dr. Carlos" role="Veterinário • Santos" text="Recebi muitos clientes novos. Plataforma profissional!" image="👨‍⚕️" rating={5} delay={100} />
            <TestimonialCard name="Pet Shop Praia" role="Pet Shop • Praia Grande" text="O destaque de delivery trouxe muitos pedidos!" image="🏪" rating={5} delay={200} />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-pink-500 to-cyan-500 rounded-3xl opacity-20 blur-2xl"></div>
            <div className="relative bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Pronto para cuidar melhor?</h2>
              <p className="text-gray-400 text-lg mb-8">Junte-se a milhares de tutores e profissionais da Baixada Santista.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/registro" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">🐾 Criar Conta Grátis</Link>
                <Link href="/cadastro" className="bg-slate-800 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105">💼 Sou Profissional</Link>
              </div>
              <p className="mt-6 text-gray-500 text-sm">✓ 100% Gratuito • ✓ Sem cartão • ✓ Cadastro em 2 min</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
