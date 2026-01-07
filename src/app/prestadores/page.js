"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PrestadorCard from "@/components/PrestadorCard";
import { getPrestadores } from "@/services/prestadores.service";

const CATEGORIAS = [
  { value: "todos", label: "Todos", emoji: "🐾" },
  { value: "Veterinário", label: "Veterinários", emoji: "🏥" },
  { value: "Pet Shop", label: "Pet Shops", emoji: "🛍️" },
  { value: "Hotel", label: "Hotéis Pet", emoji: "🏨" },
  { value: "Banho e Tosa", label: "Banho e Tosa", emoji: "✂️" },
  { value: "Adestramento", label: "Adestramento", emoji: "🎓" },
  { value: "Passeador", label: "Passeadores", emoji: "🦮" },
];

function PrestadoresContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoria, setCategoria] = useState(categoriaParam || "todos");
  const [search, setSearch] = useState(searchParam || "");
  const [verificado, setVerificado] = useState(false);
  const [emergencia24h, setEmergencia24h] = useState(false);

  useEffect(() => {
    async function fetchPrestadores() {
      try {
        setLoading(true);
        setError(null);

        const data = await getPrestadores({
          categoria: categoria,
          search: search,
          verificado: verificado || undefined,
          emergencia24h: emergencia24h || undefined,
        });

        setPrestadores(data || []);
      } catch (err) {
        console.error("Erro ao carregar prestadores:", err);
        setError("Erro ao carregar prestadores. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchPrestadores();
  }, [categoria, search, verificado, emergencia24h]);

  useEffect(() => {
    if (categoriaParam) {
      setCategoria(categoriaParam);
    }
  }, [categoriaParam]);

  return (
    <>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          Prestadores de Serviços
        </h1>
        <p className="text-gray-500 font-medium max-w-xl">
          Encontre os melhores profissionais para cuidar do seu pet
        </p>
      </header>

      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome ou especialidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-all"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">Categoria</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                  categoria === cat.value
                    ? "bg-[#20B2AA] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verificado}
              onChange={(e) => setVerificado(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA]"
            />
            <span className="text-gray-700 font-medium">✓ Apenas verificados</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emergencia24h}
              onChange={(e) => setEmergencia24h(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA]"
            />
            <span className="text-gray-700 font-medium">⚡ Emergência 24h</span>
          </label>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Carregando prestadores...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20 bg-red-50 rounded-3xl">
          <span className="text-4xl block mb-4">😿</span>
          <p className="text-red-600 font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold">
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && prestadores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestadores.map((prestador) => (
            <PrestadorCard key={prestador.id} prestador={prestador} />
          ))}
        </div>
      )}

      {!loading && !error && prestadores.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-gray-500 font-bold text-lg mb-2">Nenhum prestador encontrado</p>
          <p className="text-gray-400 mb-6">Tente mudar os filtros ou a busca</p>
          <button
            onClick={() => {
              setCategoria("todos");
              setSearch("");
              setVerificado(false);
              setEmergencia24h(false);
            }}
            className="bg-[#20B2AA] text-white px-6 py-3 rounded-xl font-bold"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {!loading && !error && prestadores.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          {prestadores.length} {prestadores.length === 1 ? "prestador encontrado" : "prestadores encontrados"}
        </div>
      )}

      <div className="mt-16 bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] rounded-3xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-black mb-4">É um prestador de serviços pet?</h2>
        <p className="text-lg mb-6 opacity-90">Cadastre-se gratuitamente e conecte-se com milhares de tutores</p>
        <Link href="/cadastro" className="inline-block bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105">
          Cadastrar Meu Negócio →
        </Link>
      </div>
    </>
  );
}

export default function PrestadoresPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Carregando...</p>
          </div>
        }>
          <PrestadoresContent />
        </Suspense>
      </div>
    </main>
  );
}
