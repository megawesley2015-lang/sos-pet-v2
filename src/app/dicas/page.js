"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Página de Dicas & Bem-Estar Pet
 * 
 * Estrutura:
 * - Hero section com destaque
 * - Cards de categorias
 * - Lista de dicas por categoria
 * - CTA para contribuir
 * 
 * @returns {JSX.Element}
 */

const CATEGORIAS = [
  {
    id: "verao",
    titulo: "Verão & Calor",
    emoji: "☀️",
    cor: "bg-orange-100 text-orange-700",
    corBorda: "border-orange-200",
  },
  {
    id: "alimentacao",
    titulo: "Alimentação",
    emoji: "🍎",
    cor: "bg-green-100 text-green-700",
    corBorda: "border-green-200",
  },
  {
    id: "saude",
    titulo: "Saúde Básica",
    emoji: "🩺",
    cor: "bg-blue-100 text-blue-700",
    corBorda: "border-blue-200",
  },
  {
    id: "comportamento",
    titulo: "Comportamento",
    emoji: "🧠",
    cor: "bg-purple-100 text-purple-700",
    corBorda: "border-purple-200",
  },
];

const DICAS = [
  // Verão
  {
    id: 1,
    categoria: "verao",
    titulo: "Água sempre fresca",
    conteudo: "Troque a água do seu pet várias vezes ao dia. No calor, a água morna perde o apetite deles. Adicione pedras de gelo se necessário.",
  },
  {
    id: 2,
    categoria: "verao",
    titulo: "Evite passeios no horário de pico",
    conteudo: "Entre 10h e 16h o asfalto pode queimar as patinhas do seu pet. Faça o teste: coloque a mão no chão por 5 segundos. Se queimar, está muito quente.",
  },
  {
    id: 3,
    categoria: "verao",
    titulo: "Sombra e ventilação salvam vidas",
    conteudo: "Nunca deixe seu pet em carros fechados ou áreas sem ventilação. A temperatura interna pode subir rapidamente e causar hipertermia.",
  },
  // Alimentação
  {
    id: 4,
    categoria: "alimentacao",
    titulo: "Frutas permitidas",
    conteudo: "Melancia (sem sementes), maçã (sem sementes), banana e manga podem ser oferecidas com moderação. São refrescantes e nutritivas!",
  },
  {
    id: 5,
    categoria: "alimentacao",
    titulo: "Alimentos proibidos",
    conteudo: "NUNCA dê: chocolate, uva, cebola, alho, abacate, café ou álcool. Esses alimentos são tóxicos e podem ser fatais para pets.",
  },
  {
    id: 6,
    categoria: "alimentacao",
    titulo: "Quantidade ideal de ração",
    conteudo: "Siga as orientações do veterinário e da embalagem. O excesso de comida causa obesidade e problemas articulares.",
  },
  // Saúde
  {
    id: 7,
    categoria: "saude",
    titulo: "Sinais de alerta",
    conteudo: "Fique atento a: letargia excessiva, falta de apetite por mais de 24h, vômitos frequentes, diarreia com sangue ou dificuldade para respirar.",
  },
  {
    id: 8,
    categoria: "saude",
    titulo: "Vacinação em dia",
    conteudo: "Mantenha a carteira de vacinação atualizada. As vacinas V8/V10 para cães e V4/V5 para gatos são essenciais.",
  },
  {
    id: 9,
    categoria: "saude",
    titulo: "Carrapatos e pulgas",
    conteudo: "No verão, a infestação aumenta. Use preventivos mensais e verifique o pelo do seu pet regularmente, especialmente atrás das orelhas.",
  },
  // Comportamento
  {
    id: 10,
    categoria: "comportamento",
    titulo: "Ansiedade de separação",
    conteudo: "Se seu pet destrói coisas quando fica sozinho, pode ser ansiedade. Deixe brinquedos interativos e evite despedidas prolongadas.",
  },
  {
    id: 11,
    categoria: "comportamento",
    titulo: "Socialização é importante",
    conteudo: "Pets bem socializados são mais equilibrados. Apresente novos ambientes, pessoas e animais gradualmente desde filhote.",
  },
  {
    id: 12,
    categoria: "comportamento",
    titulo: "Mudança de comportamento",
    conteudo: "Se seu pet mudou o comportamento de repente (agressividade, apatia, esconder-se), pode indicar dor ou doença. Consulte um veterinário.",
  },
];

export default function DicasPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [dicaExpandida, setDicaExpandida] = useState(null);

  const dicasFiltradas = categoriaAtiva === "todas" 
    ? DICAS 
    : DICAS.filter(d => d.categoria === categoriaAtiva);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-6xl mb-4 block">💡</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Dicas & Bem-Estar Pet
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
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
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              categoriaAtiva === "todas"
                ? "bg-[#20B2AA] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Todas
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`px-5 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                categoriaAtiva === cat.id
                  ? "bg-[#20B2AA] text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.titulo}</span>
            </button>
          ))}
        </div>

        {/* Lista de Dicas */}
        <div className="space-y-4">
          {dicasFiltradas.map((dica) => {
            const categoria = CATEGORIAS.find(c => c.id === dica.categoria);
            const isExpanded = dicaExpandida === dica.id;

            return (
              <div
                key={dica.id}
                className={`bg-white rounded-2xl border-2 ${categoria?.corBorda} overflow-hidden transition-all hover:shadow-md`}
              >
                <button
                  onClick={() => setDicaExpandida(isExpanded ? null : dica.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoria?.cor}`}>
                      {categoria?.emoji} {categoria?.titulo}
                    </span>
                    <h3 className="font-bold text-gray-800">{dica.titulo}</h3>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-gray-600 leading-relaxed pl-4 border-l-4 border-[#20B2AA]">
                      {dica.conteudo}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aviso Legal */}
        <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h4 className="font-bold text-yellow-800 mb-1">Aviso Importante</h4>
              <p className="text-yellow-700 text-sm">
                As dicas aqui apresentadas possuem caráter informativo e educativo. 
                Elas não substituem a consulta e orientação de um médico veterinário. 
                Em caso de emergência ou dúvidas sobre a saúde do seu pet, procure um profissional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Precisa de ajuda profissional?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/prestadores"
              className="px-8 py-4 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all"
            >
              🏥 Encontrar Veterinário
            </Link>
            <Link
              href="/prestadores?emergencia=true"
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all"
            >
              🚨 Emergência 24h
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
