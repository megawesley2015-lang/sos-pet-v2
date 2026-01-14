"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PetCard from "@/components/PetCard";
import { getPets } from "@/services/pets.service";

/**
 * Configuração de filtros
 */
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

/**
 * Cidades da Baixada Santista
 * Ordenadas por população/relevância
 */
const CIDADES_BAIXADA_SANTISTA = [
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
  
  // Filtros
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterEspecie, setFilterEspecie] = useState("todos");
  const [filterCidade, setFilterCidade] = useState("todas");
  const [searchLocation, setSearchLocation] = useState("");
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);

  // Buscar pets
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
        console.error("Erro ao carregar pets:", err);
        setError("Erro ao carregar os pets. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, [filterStatus, filterEspecie, filterCidade, searchLocation]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".cidade-dropdown")) {
        setShowCidadeDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const cidadeSelecionada = CIDADES_BAIXADA_SANTISTA.find(c => c.value === filterCidade);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                  Achados e Perdidos
                </h1>
              </div>
              <p className="text-gray-500 font-medium max-w-xl">
                Ajude a reunir pets com suas famílias na Baixada Santista
              </p>
            </div>

            <Link
              href="/achados-e-perdidos/cadastrar"
              className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              📢 Reportar Animal
            </Link>
          </div>

          {/* Banner Baixada Santista */}
          <div className="mt-6 bg-gradient-to-r from-[#20B2AA] to-[#1a9e97] rounded-2xl p-4 md:p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🗺️</span>
                <div>
                  <h2 className="font-bold text-lg">Cobertura Baixada Santista</h2>
                  <p className="text-white/80 text-sm">
                    Santos, Guarujá, Praia Grande, São Vicente, Cubatão, Bertioga, Mongaguá, Itanhaém e Peruíbe
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">🐕 Cães</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🐈 Gatos</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">🐾 Outros</span>
              </div>
            </div>
          </div>
        </header>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Filtro por Cidade */}
            <div className="cidade-dropdown relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🏙️ Cidade
              </label>
              <button
                onClick={() => setShowCidadeDropdown(!showCidadeDropdown)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[#20B2AA] bg-white text-left flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>{cidadeSelecionada?.emoji}</span>
                  <span className="font-medium">{cidadeSelecionada?.label}</span>
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${showCidadeDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCidadeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
                  {CIDADES_BAIXADA_SANTISTA.map((cidade) => (
                    <button
                      key={cidade.value}
                      onClick={() => {
                        setFilterCidade(cidade.value);
                        setShowCidadeDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        filterCidade === cidade.value ? 'bg-[#20B2AA]/10 text-[#20B2AA]' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-xl">{cidade.emoji}</span>
                      <span className="font-medium">{cidade.label}</span>
                      {filterCidade === cidade.value && (
                        <span className="ml-auto text-[#20B2AA]">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📋 Status
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_STATUS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                      filterStatus === value
                        ? "bg-[#20B2AA] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Espécie */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🐾 Espécie
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_ESPECIE).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterEspecie(value)}
                    className={`px-3 py-2 rounded-lg font-bold text-xs transition-all ${
                      filterEspecie === value
                        ? "bg-[#20B2AA] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Busca por bairro */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📍 Bairro
              </label>
              <input
                type="text"
                placeholder="Ex: Pitangueiras, Enseada..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Filtros ativos */}
          {(filterStatus !== "todos" || filterEspecie !== "todos" || filterCidade !== "todas" || searchLocation) && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Filtros ativos:</span>
              
              {filterCidade !== "todas" && (
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {cidadeSelecionada?.emoji} {cidadeSelecionada?.label}
                  <button onClick={() => setFilterCidade("todas")} className="ml-1 hover:text-[#1a9e97]">×</button>
                </span>
              )}
              
              {filterStatus !== "todos" && (
                <span className="bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {FILTER_STATUS[filterStatus]}
                  <button onClick={() => setFilterStatus("todos")} className="ml-1 hover:text-[#e85a2a]">×</button>
                </span>
              )}
              
              {filterEspecie !== "todos" && (
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {FILTER_ESPECIE[filterEspecie]}
                  <button onClick={() => setFilterEspecie("todos")} className="ml-1 hover:text-purple-700">×</button>
                </span>
              )}
              
              {searchLocation && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  📍 {searchLocation}
                  <button onClick={() => setSearchLocation("")} className="ml-1 hover:text-gray-800">×</button>
                </span>
              )}
              
              <button
                onClick={() => {
                  setFilterStatus("todos");
                  setFilterEspecie("todos");
                  setFilterCidade("todas");
                  setSearchLocation("");
                }}
                className="text-sm text-red-500 hover:text-red-600 font-medium ml-2"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Carregando pets...</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="text-center py-20 bg-red-50 rounded-3xl">
            <span className="text-4xl block mb-4">😿</span>
            <p className="text-red-600 font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de Pets */}
        {!loading && !error && pets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}

        {/* Estado Vazio */}
        {!loading && !error && pets.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-gray-500 font-bold text-lg mb-2">
              Nenhum animal encontrado
            </p>
            <p className="text-gray-400 mb-6">
              {filterCidade !== "todas" 
                ? `Não encontramos pets em ${cidadeSelecionada?.label}. Tente ampliar a busca.`
                : "Tente mudar os filtros ou cadastre um novo animal"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {filterCidade !== "todas" && (
                <button
                  onClick={() => setFilterCidade("todas")}
                  className="px-6 py-3 bg-[#20B2AA] text-white rounded-xl font-bold"
                >
                  🗺️ Ver toda Baixada Santista
                </button>
              )}
              <Link
                href="/achados-e-perdidos/cadastrar"
                className="px-6 py-3 bg-[#FF6B35] text-white rounded-xl font-bold"
              >
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
