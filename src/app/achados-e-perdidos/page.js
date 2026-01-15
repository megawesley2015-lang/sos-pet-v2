"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PetCard from "@/components/PetCard";
import { getPets } from "@/services/pets.service";

const FILTER_STATUS = {
  todos: "Todos",
  perdido: "Perdidos",
  encontrado: "Encontrados",
  adocao: "Para Adoção",
};

const FILTER_ESPECIE = {
  todos: "Todas",
  cao: "Cães",
  gato: "Gatos",
  outro: "Outros",
};

const CIDADES = [
  { value: "todas", label: "Toda Baixada Santista", emoji: "🗺️" },
  { value: "santos", label: "Santos", emoji: "⚓" },
  { value: "guaruja", label: "Guarujá", emoji: "🏖️" },
  { value: "praia-grande", label: "Praia Grande", emoji: "🌊" },
  { value: "sao-vicente", label: "São Vicente", emoji: "🏛️" },
  { value: "cubatao", label: "Cubatão", emoji: "🏭" },
  { value: "bertioga", label: "Bertioga", emoji: "🌴" },
  { value: "mongagua", label: "Mongaguá", emoji: "🐟" },
  { value: "itanhaem", label: "Itanhaém", emoji: "🏄" },
  { value: "peruibe", label: "Peruíbe", emoji: "🦜" },
];

export default function AchadosEPerdidos() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterEspecie, setFilterEspecie] = useState("todos");
  const [filterCidade, setFilterCidade] = useState("todas");
  const [searchLocation, setSearchLocation] = useState("");
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);

  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        setError(null);
        const data = await getPets({
          status: filterStatus,
          especie: filterEspecie,
          cidade: filterCidade,
          localizacao: searchLocation,
        });
        setPets(data || []);
      } catch (err) {
        setError("Erro ao carregar os pets. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, [filterStatus, filterEspecie, filterCidade, searchLocation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".cidade-dropdown")) setShowCidadeDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const cidadeSelecionada = CIDADES.find(c => c.value === filterCidade);

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-12">
      <style jsx global>{`
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Radar animation */}
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse-ring"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🚨</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white">
                  Achados e <span className="text-red-400">Perdidos</span>
                </h1>
              </div>
              <p className="text-gray-400 max-w-xl">
                Ajude a reunir pets com suas famílias na Baixada Santista
              </p>
            </div>

            <Link
              href="/achados-e-perdidos/cadastrar"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              📢 Reportar Animal
            </Link>
          </div>

          {/* Banner Cobertura */}
          <div className="mt-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🗺️</span>
                </div>
                <div>
                  <h2 className="font-bold text-white">Cobertura Baixada Santista</h2>
                  <p className="text-gray-400 text-sm">Santos, Guarujá, Praia Grande e mais 6 cidades</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-gray-300">🐕 Cães</span>
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-gray-300">🐈 Gatos</span>
                <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-gray-300">🐾 Outros</span>
              </div>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Cidade Dropdown */}
            <div className="cidade-dropdown relative">
              <label className="block text-sm font-bold text-gray-400 mb-2">🏙️ Cidade</label>
              <button
                onClick={() => setShowCidadeDropdown(!showCidadeDropdown)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-left flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2 text-white">
                  <span>{cidadeSelecionada?.emoji}</span>
                  <span>{cidadeSelecionada?.label}</span>
                </span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCidadeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCidadeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50 max-h-80 overflow-y-auto">
                  {CIDADES.map((cidade) => (
                    <button
                      key={cidade.value}
                      onClick={() => { setFilterCidade(cidade.value); setShowCidadeDropdown(false); }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-700 transition-colors ${
                        filterCidade === cidade.value ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-xl">{cidade.emoji}</span>
                      <span>{cidade.label}</span>
                      {filterCidade === cidade.value && <span className="ml-auto text-cyan-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">📋 Status</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_STATUS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                      filterStatus === value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Espécie */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">🐾 Espécie</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_ESPECIE).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterEspecie(value)}
                    className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                      filterEspecie === value
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2">📍 Bairro</label>
              <input
                type="text"
                placeholder="Ex: Pitangueiras, Enseada..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Filtros ativos */}
          {(filterStatus !== "todos" || filterEspecie !== "todos" || filterCidade !== "todas" || searchLocation) && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filtros:</span>
              
              {filterCidade !== "todas" && (
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {cidadeSelecionada?.emoji} {cidadeSelecionada?.label}
                  <button onClick={() => setFilterCidade("todas")} className="ml-1 hover:text-white">×</button>
                </span>
              )}
              
              {filterStatus !== "todos" && (
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {FILTER_STATUS[filterStatus]}
                  <button onClick={() => setFilterStatus("todos")} className="ml-1 hover:text-white">×</button>
                </span>
              )}
              
              {filterEspecie !== "todos" && (
                <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {FILTER_ESPECIE[filterEspecie]}
                  <button onClick={() => setFilterEspecie("todos")} className="ml-1 hover:text-white">×</button>
                </span>
              )}
              
              {searchLocation && (
                <span className="bg-slate-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  📍 {searchLocation}
                  <button onClick={() => setSearchLocation("")} className="ml-1 hover:text-white">×</button>
                </span>
              )}
              
              <button
                onClick={() => { setFilterStatus("todos"); setFilterEspecie("todos"); setFilterCidade("todas"); setSearchLocation(""); }}
                className="text-sm text-red-400 hover:text-red-300 font-medium ml-2"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400">Carregando pets...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="text-center py-20 bg-slate-900/50 border border-red-500/30 rounded-3xl">
            <span className="text-5xl block mb-4">😿</span>
            <p className="text-red-400 font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl font-bold">
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de Pets */}
        {!loading && !error && pets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, i) => (
              <div key={pet.id} className="animate-float" style={{ animationDelay: `${i * 100}ms` }}>
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        )}

        {/* Estado Vazio */}
        {!loading && !error && pets.length === 0 && (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-white font-bold text-lg mb-2">Nenhum animal encontrado</p>
            <p className="text-gray-400 mb-6">
              {filterCidade !== "todas" ? `Não encontramos pets em ${cidadeSelecionada?.label}.` : "Tente mudar os filtros ou cadastre um novo animal"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {filterCidade !== "todas" && (
                <button onClick={() => setFilterCidade("todas")} className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-bold">
                  🗺️ Ver toda Baixada Santista
                </button>
              )}
              <Link href="/achados-e-perdidos/cadastrar" className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold">
                📢 Cadastrar Animal
              </Link>
            </div>
          </div>
        )}

        {/* Contador */}
        {!loading && !error && pets.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            {pets.length} {pets.length === 1 ? "animal encontrado" : "animais encontrados"}
            {filterCidade !== "todas" && ` em ${cidadeSelecionada?.label}`}
          </div>
        )}
      </div>
    </main>
  );
}
