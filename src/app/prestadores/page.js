"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PrestadorCard from "@/components/PrestadorCard";
import { getPrestadores } from "@/services/prestadores.service";

const CATEGORIAS = [
  { value: "todos", label: "Todos", emoji: "🐾" },
  { value: "Veterinário", label: "Veterinários", emoji: "🏥" },
  { value: "Pet Shop", label: "Pet Shops", emoji: "🛒" },
  { value: "Hotel", label: "Hotéis Pet", emoji: "🏨" },
  { value: "Banho e Tosa", label: "Banho e Tosa", emoji: "✂️" },
  { value: "Adestramento", label: "Adestramento", emoji: "🎓" },
  { value: "Passeador", label: "Passeadores", emoji: "🦮" },
];

function PrestadoresContent() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const emergenciaParam = searchParams.get("emergencia24h");

  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoria, setCategoria] = useState(categoriaParam || "todos");
  const [search, setSearch] = useState(searchParam || "");
  const [verificado, setVerificado] = useState(false);
  const [emergencia24h, setEmergencia24h] = useState(emergenciaParam === "true");

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
        setError("Erro ao carregar prestadores. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    fetchPrestadores();
  }, [categoria, search, verificado, emergencia24h]);

  useEffect(() => {
    if (categoriaParam) setCategoria(categoriaParam);
  }, [categoriaParam]);

  return (
    <>
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.2); } 50% { box-shadow: 0 0 40px rgba(6, 182, 212, 0.4); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Prestadores de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Serviços</span>
          </h1>
        </div>
        <p className="text-gray-400 max-w-xl">
          Encontre os melhores profissionais para cuidar do seu pet
        </p>
      </header>

      {/* Filtros */}
      <div className="relative z-10 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 mb-8">
        
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-50"></div>
            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-xl">
              <span className="pl-4 text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nome ou especialidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-4 bg-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Categorias */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-400 mb-3">Categoria</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  categoria === cat.value
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative w-12 h-6 rounded-full transition-all ${verificado ? 'bg-cyan-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${verificado ? 'left-7' : 'left-1'}`}></div>
            </div>
            <input type="checkbox" checked={verificado} onChange={(e) => setVerificado(e.target.checked)} className="sr-only" />
            <span className="text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
              <span className="text-cyan-400">✓</span> Apenas verificados
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`relative w-12 h-6 rounded-full transition-all ${emergencia24h ? 'bg-red-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emergencia24h ? 'left-7' : 'left-1'}`}></div>
            </div>
            <input type="checkbox" checked={emergencia24h} onChange={(e) => setEmergencia24h(e.target.checked)} className="sr-only" />
            <span className="text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
              <span className="text-red-400">⚡</span> Emergência 24h
            </span>
          </label>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-400">Carregando prestadores...</p>
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

      {/* Grid */}
      {!loading && !error && prestadores.length > 0 && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prestadores.map((prestador, i) => (
            <div key={prestador.id} className="animate-float" style={{ animationDelay: `${i * 100}ms` }}>
              <PrestadorCard prestador={prestador} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && prestadores.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-800">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-white font-bold text-lg mb-2">Nenhum prestador encontrado</p>
          <p className="text-gray-400 mb-6">Tente mudar os filtros ou a busca</p>
          <button
            onClick={() => { setCategoria("todos"); setSearch(""); setVerificado(false); setEmergencia24h(false); }}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Contador */}
      {!loading && !error && prestadores.length > 0 && (
        <div className="mt-8 text-center text-gray-500">
          {prestadores.length} {prestadores.length === 1 ? "prestador encontrado" : "prestadores encontrados"}
        </div>
      )}

      {/* CTA para prestadores */}
      <div className="relative z-10 mt-16">
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
              É um prestador de serviços pet?
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              Cadastre-se gratuitamente e conecte-se com milhares de tutores
            </p>
            <Link 
              href="/cadastro" 
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              Cadastrar Meu Negócio →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PrestadoresPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Suspense fallback={
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-400">Carregando...</p>
          </div>
        }>
          <PrestadoresContent />
        </Suspense>
      </div>
    </main>
  );
}
