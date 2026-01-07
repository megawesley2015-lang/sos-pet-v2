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

export default function AchadosEPerdidos() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtros
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterEspecie, setFilterEspecie] = useState("todos");
  const [searchLocation, setSearchLocation] = useState("");

  // Buscar pets
  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getPets({
          status: filterStatus,
          especie: filterEspecie,
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
  }, [filterStatus, filterEspecie, searchLocation]);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
              Achados e Perdidos
            </h1>
            <p className="text-gray-500 font-medium max-w-xl">
              Ajude a reunir pets com suas famílias ou encontre um novo amigo para amar.
            </p>
          </div>

          <Link
            href="/achados-e-perdidos/cadastrar"
            className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
          >
            📢 Reportar Animal
          </Link>
        </header>

        {/* Filtros */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Filtro por Status */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_STATUS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
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
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Espécie
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FILTER_ESPECIE).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilterEspecie(value)}
                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
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

            {/* Busca por localização */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Localização
              </label>
              <input
                type="text"
                placeholder="Buscar por bairro ou cidade..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
              />
            </div>
          </div>
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
              Tente mudar os filtros ou cadastre um novo animal
            </p>
            <Link
              href="/achados-e-perdidos/cadastrar"
              className="inline-block bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-bold"
            >
              Cadastrar Animal
            </Link>
          </div>
        )}

        {/* Contador */}
        {!loading && !error && pets.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            {pets.length} {pets.length === 1 ? "animal encontrado" : "animais encontrados"}
          </div>
        )}
      </div>
    </main>
  );
}
