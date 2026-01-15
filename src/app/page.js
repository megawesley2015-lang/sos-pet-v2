"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || end === 0) { if (start) setCount(end); return; }
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  return count;
}

function PainCard({ icon, question, solution }) {
  const [hover, setHover] = useState(false);
  return (
    <div className={`relative cursor-pointer transition-all duration-500 ${hover ? 'scale-105' : ''}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl blur-lg transition-opacity ${hover ? 'opacity-30' : 'opacity-0'}`}></div>
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full hover:border-cyan-500/50 transition-all">
        <div className={`w-14 h-14 bg-gradient-to-br from-orange-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 ${hover ? 'animate-pulse' : ''}`}>
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="text-white font-bold text-lg mb-3">{question}</h3>
        <div className={`transition-all duration-500 overflow-hidden ${hover ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'}`}>
          <p className="text-cyan-400 text-sm flex items-start gap-2"><span className="text-green-400">✓</span>{solution}</p>
        </div>
        <p className={`text-gray-500 text-sm mt-3 transition-opacity ${hover ? 'opacity-0' : 'opacity-100'}`}>Passe o mouse →</p>
      </div>
    </div>
  );
}

function StatCard({ value, label, icon, isVisible }) {
  const animated = useCountUp(value, 2000, isVisible);
  return (
    <div className="text-center group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl md:text-4xl font-black text-white mb-1">{animated.toLocaleString("pt-BR")}+</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function CompareItem({ icon, text, type }) {
  const old = type === 'old';
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${old ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
      <span className={`text-xl ${old ? 'text-red-400' : 'text-green-400'}`}>{icon}</span>
      <span className={`text-sm ${old ? 'text-red-300' : 'text-green-300'}`}>{text}</span>
    </div>
  );
}

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ prestadores: 0, pets: 0, reunidos: 0, avistamentos: 0 });
  const [statsVis, setStatsVis] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [p, pe, r, a] = await Promise.all([
          supabase.from("prestadores").select("*", { count: "exact", head: true }).eq("status", "aprovado"),
          supabase.from("pets").select("*", { count: "exact", head: true }),
          supabase.from("pets").select("*", { count: "exact", head: true }).eq("status", "encontrado"),
          supabase.from("avistamentos").select("*", { count: "exact", head: true }),
        ]);
        setStats({ prestadores: p.count || 0, pets: pe.count || 0, reunidos: r.count || 0, avistamentos: a.count || 0 });
      } catch (e) { console.error(e); }
    })();
  }, []);

  const pains = [
    { icon: "💉", question: "Perdeu a carteira de vacinas?", solution: "Histórico digital completo, sempre acessível." },
    { icon: "📅", question: "Esquece compromissos do pet?", solution: "Lembretes automáticos de vacinas e consultas." },
    { icon: "🔍", question: "Pet fugiu?", solution: "Alerta instantâneo + mapa de avistamentos." },
    { icon: "🏥", question: "Vet às 3h da manhã?", solution: "Clínicas 24h com um clique." }
  ];

  const cities = ["Santos ⚓", "Guarujá 🏖️", "Praia Grande 🌊", "São Vicente 🏛️", "Cubatão 🏭", "Bertioga 🌴", "Mongaguá 🐟", "Itanhaém 🏄", "Peruíbe 🦜"];

  return (
    <main className="min-h-screen bg-slate-950 overflow-hidden">
      <style jsx global>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slower { animation: spin-slow 30s linear infinite; }
        .animate-spin-rev { animation: spin-rev 25s linear infinite; }
      `}</style>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
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
              
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fadeInUp" style={{animationDelay:'100ms'}}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">SOS Pet</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-2 animate-fadeInUp" style={{animationDelay:'150ms'}}>
                <span className="text-orange-400 font-semibold">Conectando</span> quem ama
              </p>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fadeInUp" style={{animationDelay:'200ms'}}>
                com <span className="text-cyan-400 font-semibold">quem cuida</span>.
              </p>

              <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto lg:mx-0 animate-fadeInUp" style={{animationDelay:'250ms'}}>
                Tecnologia de ponta + amor pelos pets. Encontre serviços, reúna famílias e cuide de quem você ama.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/prestadores?search=${encodeURIComponent(search)}`; }} className="mb-6 animate-fadeInUp" style={{animationDelay:'300ms'}}>
                <div className="relative max-w-lg mx-auto lg:mx-0">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-slate-900/90 border border-slate-700 rounded-2xl p-2 flex items-center">
                    <span className="text-xl ml-4 text-gray-500">🔍</span>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar veterinário, pet shop..." className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 outline-none" />
                    <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">Buscar</button>
                  </div>
                </div>
              </form>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fadeInUp" style={{animationDelay:'350ms'}}>
                <Link href="/achados-e-perdidos" className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 text-red-400 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition-all">🚨 Pet Perdido</Link>
                <Link href="/prestadores?emergencia24h=true" className="flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition-all">🏥 Emergência 24h</Link>
                <Link href="/prestadores" className="flex items-center gap-2 bg-slate-700/50 border border-slate-600 text-gray-300 px-5 py-3 rounded-xl font-semibold hover:scale-105 transition-all">🔍 Serviços</Link>
              </div>
            </div>

            {/* MOCKUP */}
            <div className="relative flex justify-center animate-fadeInUp" style={{animationDelay:'400ms'}}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px]"></div>
              </div>
              
              <div className="absolute top-5 right-5 md:top-10 md:right-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-3 animate-float shadow-xl z-20">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐕</span>
                  <div><p className="text-white font-bold text-sm">Max Encontrado!</p><p className="text-green-400 text-xs">Família reunida ❤️</p></div>
                </div>
              </div>
              
              <div className="absolute bottom-20 left-0 bg-slate-800/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 animate-float shadow-xl z-20" style={{animationDelay:'1s'}}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <div><p className="text-white font-bold text-sm">Novo Avistamento</p><p className="text-cyan-400 text-xs">Pitangueiras, Guarujá</p></div>
                </div>
              </div>
              
              <div className="relative z-10 w-64 md:w-72">
                <div className="bg-gradient-to-b from-slate-600 to-slate-800 rounded-[3rem] p-2 shadow-2xl">
                  <div className="bg-[#0a1628] rounded-[2.5rem] overflow-hidden">
                    <div className="h-7 bg-[#0a1628] flex justify-center items-end pb-1"><div className="w-24 h-5 bg-black rounded-full"></div></div>
                    <div className="h-[420px] bg-gradient-to-b from-[#0f1a2e] via-[#0a1628] to-[#0f1a2e] flex flex-col items-center relative">
                      <div className="w-full px-5 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2"><span className="text-lg">🐾</span><span className="text-white font-bold text-sm">SOS Pet</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div><span className="text-emerald-400 text-xs">Online</span></div>
                      </div>
                      <div className="flex-1 flex items-center justify-center relative">
                        <div className="absolute w-52 h-52 rounded-full border border-slate-700/30 animate-spin-slower"><div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400/40 rounded-full"></div></div>
                        <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-spin-rev"><div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div></div>
                        <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30 animate-spin-slow"><div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80"></div></div>
                        <Link href="/meus-pets" className="relative group">
                          <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/30 transition-all"></div>
                          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-slate-700/80 to-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all">
                            <svg className="w-14 h-14 md:w-16 md:h-16" viewBox="0 0 100 100" fill="none">
                              <ellipse cx="50" cy="65" rx="18" ry="15" fill="#f97316" />
                              <ellipse cx="28" cy="45" rx="10" ry="12" fill="#f97316" />
                              <ellipse cx="72" cy="45" rx="10" ry="12" fill="#f97316" />
                              <ellipse cx="38" cy="28" rx="8" ry="10" fill="#f97316" />
                              <ellipse cx="62" cy="28" rx="8" ry="10" fill="#f97316" />
                            </svg>
                          </div>
                        </Link>
                      </div>
                      <div className="text-center mb-3"><p className="text-white font-bold">Meus Pets</p><p className="text-gray-400 text-xs">Acesse o perfil dos seus pets</p></div>
                      <div className="w-full px-4 pb-5">
                        <div className="bg-slate-800/60 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center"><span>🔔</span></div>
                              <div><p className="text-white font-bold text-sm">Home do Tutor</p><p className="text-gray-400 text-xs">Vacinas • Perfil • Alertas</p></div>
                            </div>
                            <span className="text-cyan-400">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <p className="text-gray-400">Passe o mouse para ver a solução</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pains.map((p, i) => <PainCard key={i} {...p} />)}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-black text-white">Evolua o cuidado com seu <span className="text-cyan-400">pet</span></h2></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 border border-red-500/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl">📋</div><div><h3 className="text-xl font-bold text-white">Método Tradicional</h3><p className="text-red-400 text-sm">Desorganizado</p></div></div>
              <div className="space-y-3">
                <CompareItem icon="❌" text="Carteira de vacina que some" type="old" />
                <CompareItem icon="❌" text="Esquece datas importantes" type="old" />
                <CompareItem icon="❌" text="Pet foge sem saber o que fazer" type="old" />
                <CompareItem icon="❌" text="Liga pra 10 vets de madrugada" type="old" />
              </div>
            </div>
            <div className="bg-slate-900/50 border border-green-500/20 rounded-3xl p-8 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-3xl blur-xl -z-10"></div>
              <div className="flex items-center gap-3 mb-6"><div className="w-12 h-12 bg-gradient-to-br from-cyan-500/30 to-green-500/30 rounded-xl flex items-center justify-center text-2xl">🐾</div><div><h3 className="text-xl font-bold text-white">Com SOS Pet</h3><p className="text-green-400 text-sm">Tudo na palma da mão</p></div></div>
              <div className="space-y-3">
                <CompareItem icon="✓" text="Histórico digital completo" type="new" />
                <CompareItem icon="✓" text="Lembretes automáticos" type="new" />
                <CompareItem icon="✓" text="Alerta comunidade em segundos" type="new" />
                <CompareItem icon="✓" text="Clínicas 24h com um clique" type="new" />
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/registro" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all">Começar Gratuitamente →</Link>
          </div>
        </div>
      </section>

      {/* PARA QUEM */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-black text-white">Feito para <span className="text-orange-400">você</span></h2></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-4xl">🐕</div><div><h3 className="text-2xl font-bold text-white">Sou Tutor</h3><p className="text-gray-400">Cuide do seu melhor amigo</p></div></div>
              <ul className="space-y-3 mb-8">{["Perfil completo do pet", "Alertas de vacinas", "Serviços avaliados", "Busca de pets perdidos"].map((t, i) => <li key={i} className="flex items-start gap-3 text-gray-300"><span className="text-cyan-400">✓</span>{t}</li>)}</ul>
              <Link href="/registro" className="block w-full text-center bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-xl font-bold transition-all">Criar Conta Grátis</Link>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 hover:border-orange-500/30 transition-all">
              <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center text-4xl">💼</div><div><h3 className="text-2xl font-bold text-white">Sou Profissional</h3><p className="text-gray-400">Atraia mais clientes</p></div></div>
              <ul className="space-y-3 mb-8">{["Perfil profissional", "Milhares de tutores", "Agendamentos online", "Dashboard de métricas"].map((t, i) => <li key={i} className="flex items-start gap-3 text-gray-300"><span className="text-orange-400">✓</span>{t}</li>)}</ul>
              <Link href="/cadastro" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-all">Cadastrar Negócio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Cobertura <span className="text-cyan-400">Baixada Santista</span></h2>
            <div className="flex flex-wrap justify-center gap-3 my-8">{cities.map((c) => <span key={c} className="bg-slate-800/80 border border-slate-700/50 px-4 py-2 rounded-full text-gray-300 text-sm">{c}</span>)}</div>
            <Link href="/achados-e-perdidos" className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-xl font-semibold">🗺️ Ver Mapa de Pets</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-orange-500/5"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={stats.prestadores || 25} label="Prestadores" icon="🏥" isVisible={statsVis} />
            <StatCard value={stats.pets || 150} label="Pets Cadastrados" icon="🐾" isVisible={statsVis} />
            <StatCard value={stats.reunidos || 45} label="Famílias Reunidas" icon="💚" isVisible={statsVis} />
            <StatCard value={stats.avistamentos || 200} label="Avistamentos" icon="👀" isVisible={statsVis} />
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-black text-white">O que dizem sobre <span className="text-orange-400">nós</span></h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Maria Santos", role: "Tutora • Guarujá", text: "Encontrei minha Luna em 3 dias! O mapa foi essencial.", img: "👩" },
              { name: "Dr. Carlos", role: "Veterinário • Santos", text: "Recebi muitos clientes novos. Plataforma profissional!", img: "👨‍⚕️" },
              { name: "Pet Shop Praia", role: "Pet Shop • Praia Grande", text: "O destaque de delivery trouxe muitos pedidos!", img: "🏪" }
            ].map((t, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <span key={j} className="text-yellow-400">★</span>)}</div>
                <p className="text-gray-300 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl">{t.img}</div>
                  <div><p className="font-bold text-white">{t.name}</p><p className="text-sm text-gray-500">{t.role}</p></div>
                </div>
              </div>
            ))}
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
                <Link href="/registro" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all">🐾 Criar Conta Grátis</Link>
                <Link href="/cadastro" className="bg-slate-800 border border-slate-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all">💼 Sou Profissional</Link>
              </div>
              <p className="mt-6 text-gray-500 text-sm">✓ 100% Gratuito • ✓ Sem cartão • ✓ Cadastro em 2 min</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
