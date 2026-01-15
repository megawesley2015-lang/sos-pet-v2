"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIAS = [
  { id: "verao", titulo: "Verão & Calor", emoji: "☀️", cor: "from-orange-500 to-yellow-500", bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
  { id: "alimentacao", titulo: "Alimentação", emoji: "🍎", cor: "from-green-500 to-emerald-500", bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
  { id: "saude", titulo: "Saúde Básica", emoji: "🩺", cor: "from-blue-500 to-cyan-500", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  { id: "comportamento", titulo: "Comportamento", emoji: "🧠", cor: "from-purple-500 to-pink-500", bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
];

const DICAS = [
  { id: 1, categoria: "verao", titulo: "Água sempre fresca", conteudo: "Troque a água do seu pet várias vezes ao dia. No calor, a água morna perde o apetite deles. Adicione pedras de gelo se necessário." },
  { id: 2, categoria: "verao", titulo: "Evite passeios no horário de pico", conteudo: "Entre 10h e 16h o asfalto pode queimar as patinhas do seu pet. Faça o teste: coloque a mão no chão por 5 segundos. Se queimar, está muito quente." },
  { id: 3, categoria: "verao", titulo: "Sombra e ventilação salvam vidas", conteudo: "Nunca deixe seu pet em carros fechados ou áreas sem ventilação. A temperatura interna pode subir rapidamente e causar hipertermia." },
  { id: 4, categoria: "alimentacao", titulo: "Frutas permitidas", conteudo: "Melancia (sem sementes), maçã (sem sementes), banana e manga podem ser oferecidas com moderação. São refrescantes e nutritivas!" },
  { id: 5, categoria: "alimentacao", titulo: "Alimentos proibidos", conteudo: "NUNCA dê: chocolate, uva, cebola, alho, abacate, café ou álcool. Esses alimentos são tóxicos e podem ser fatais para pets." },
  { id: 6, categoria: "alimentacao", titulo: "Quantidade ideal de ração", conteudo: "Siga as orientações do veterinário e da embalagem. O excesso de comida causa obesidade e problemas articulares." },
  { id: 7, categoria: "saude", titulo: "Sinais de alerta", conteudo: "Fique atento a: letargia excessiva, falta de apetite por mais de 24h, vômitos frequentes, diarreia com sangue ou dificuldade para respirar." },
  { id: 8, categoria: "saude", titulo: "Vacinação em dia", conteudo: "Mantenha a carteira de vacinação atualizada. As vacinas V8/V10 para cães e V4/V5 para gatos são essenciais." },
  { id: 9, categoria: "saude", titulo: "Carrapatos e pulgas", conteudo: "No verão, a infestação aumenta. Use preventivos mensais e verifique o pelo do seu pet regularmente, especialmente atrás das orelhas." },
  { id: 10, categoria: "comportamento", titulo: "Ansiedade de separação", conteudo: "Se seu pet destrói coisas quando fica sozinho, pode ser ansiedade. Deixe brinquedos interativos e evite despedidas prolongadas." },
  { id: 11, categoria: "comportamento", titulo: "Socialização é importante", conteudo: "Pets bem socializados são mais equilibrados. Apresente novos ambientes, pessoas e animais gradualmente desde filhote." },
  { id: 12, categoria: "comportamento", titulo: "Mudança de comportamento", conteudo: "Se seu pet mudou o comportamento de repente (agressividade, apatia, esconder-se), pode indicar dor ou doença. Consulte um veterinário." },
];

export default function DicasPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [dicaExpandida, setDicaExpandida] = useState(null);

  const dicasFiltradas = categoriaAtiva === "todas" 
    ? DICAS 
    : DICAS.filter(d => d.categoria === categoriaAtiva);

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">💡</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Dicas & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Bem-Estar</span> Pet
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Informações úteis para cuidar melhor do seu companheiro. 
            Conteúdo educativo, sem substituir orientação veterinária.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Filtro por Categoria */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setCategoriaAtiva("todas")}
            className={`px-5 py-3 rounded-xl font-bold transition-all ${
              categoriaAtiva === "todas"
                ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25"
                : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            Todas
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                categoriaAtiva === cat.id
                  ? `bg-gradient-to-r ${cat.cor} text-white shadow-lg`
                  : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.titulo}</span>
            </button>
          ))}
        </div>

        {/* Lista de Dicas */}
        <div className="space-y-4">
          {dicasFiltradas.map((dica, index) => {
            const categoria = CATEGORIAS.find(c => c.id === dica.categoria);
            const isExpanded = dicaExpandida === dica.id;

            return (
              <div
                key={dica.id}
                className={`bg-slate-900/50 backdrop-blur-sm border ${categoria?.border || 'border-slate-800'} rounded-2xl overflow-hidden transition-all hover:border-opacity-100 animate-float`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => setDicaExpandida(isExpanded ? null : dica.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className={`${categoria?.bg} ${categoria?.text} ${categoria?.border} border px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2`}>
                      <span>{categoria?.emoji}</span>
                      <span className="hidden sm:inline">{categoria?.titulo}</span>
                    </span>
                    <h3 className="font-bold text-white">{dica.titulo}</h3>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${categoria?.bg} flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className={`w-5 h-5 ${categoria?.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <div className={`relative pl-5 border-l-4 ${categoria?.border?.replace('border-', 'border-l-')}`}>
                      <p className="text-gray-300 leading-relaxed">{dica.conteudo}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aviso Legal */}
        <div className="mt-12 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">Aviso Importante</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  As dicas aqui apresentadas possuem caráter informativo e educativo. 
                  Elas não substituem a consulta e orientação de um médico veterinário. 
                  Em caso de emergência ou dúvidas sobre a saúde do seu pet, procure um profissional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-6">
            Precisa de ajuda profissional?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/prestadores"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🏥</span> Encontrar Veterinário
            </Link>
            <Link
              href="/prestadores?emergencia24h=true"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>🚨</span> Emergência 24h
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
