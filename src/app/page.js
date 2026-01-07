"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/prestadores?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] min-h-[600px] flex items-center justify-center">
        <div className="max-w-5xl mx-auto px-4 text-center py-16">
          
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl md:text-6xl">🐾</span>
              <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
                SOS Pet
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white font-semibold opacity-95">
              Encontre os melhores serviços para seu pet
            </p>
          </div>

          {/* Busca */}
          <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-full shadow-2xl overflow-hidden">
              <div className="flex items-center p-2 pl-6">
                <span className="text-2xl mr-3 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por veterinário, pet shop, hotel..."
                  className="flex-1 text-base md:text-lg outline-none text-gray-700 bg-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-6 md:px-8 py-3 rounded-full font-bold transition-all hover:shadow-lg"
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="bg-white/20 backdrop-blur-sm border-2 border-white/40 px-5 py-2.5 rounded-full text-white font-bold text-sm">
              ⚡ Emergência 24h
            </span>
            <span className="bg-white/20 backdrop-blur-sm border-2 border-white/40 px-5 py-2.5 rounded-full text-white font-bold text-sm">
              🚚 Delivery Disponível
            </span>
            <span className="bg-white/20 backdrop-blur-sm border-2 border-white/40 px-5 py-2.5 rounded-full text-white font-bold text-sm">
              ✓ Profissionais Verificados
            </span>
            <span className="bg-white/20 backdrop-blur-sm border-2 border-white/40 px-5 py-2.5 rounded-full text-white font-bold text-sm">
              📅 Agendamento Online
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-gray-800">
            O que você procura?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <Link href="/prestadores?category=Veterinario" className="bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] border-2 border-[#20B2AA]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🏥</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#20B2AA]">Veterinários</h3>
              <p className="text-gray-600 text-sm">120+ prestadores</p>
            </Link>

            <Link href="/prestadores?category=Pet Shop" className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border-2 border-[#FF6B35]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🛍️</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#FF6B35]">Pet Shops</h3>
              <p className="text-gray-600 text-sm">85+ prestadores</p>
            </Link>

            <Link href="/prestadores?category=Hotel" className="bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] border-2 border-[#20B2AA]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">🏨</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#20B2AA]">Hotéis Pet</h3>
              <p className="text-gray-600 text-sm">45+ prestadores</p>
            </Link>

            <Link href="/prestadores?category=Banho e Tosa" className="bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border-2 border-[#FF6B35]/30 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2 group">
              <div className="text-5xl md:text-6xl mb-4">✂️</div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#FF6B35]">Banho e Tosa</h3>
              <p className="text-gray-600 text-sm">95+ prestadores</p>
            </Link>
          </div>
        </div>
      </section>

      {/* PRESTADORES DESTAQUE */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-gray-800">Prestadores em Destaque</h2>
              <p className="text-lg md:text-xl text-gray-600">Os melhores avaliados</p>
            </div>
            <Link href="/prestadores" className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-lg">
              Ver Todos →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🏥</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full">⚡ 24h</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Clínica Veterinária Guarujá</h3>
              <p className="text-sm text-gray-500 mb-3">Veterinário</p>
              <p className="text-gray-600 text-sm mb-4">Clínica completa com mais de 12 anos de experiência</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">5.0</span>
                <span className="text-gray-400 text-sm">(127)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🛍️</div>
              <div className="flex gap-2 mb-4">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Pet Shop Praia</h3>
              <p className="text-sm text-gray-500 mb-3">Pet Shop</p>
              <p className="text-gray-600 text-sm mb-4">Produtos premium e acessórios para todos os pets</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">4.9</span>
                <span className="text-gray-400 text-sm">(89)</span>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:border-[#20B2AA]/30">
              <div className="text-6xl md:text-7xl mb-6">🏨</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-3 py-1 rounded-full">✓ Verificado</span>
                <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full">⚡ 24h</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black mb-2 text-gray-800">Hotel Pet Paraíso</h3>
              <p className="text-sm text-gray-500 mb-3">Hotel</p>
              <p className="text-gray-600 text-sm mb-4">Hospedagem 5 estrelas com área de recreação</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="font-black text-lg">4.8</span>
                <span className="text-gray-400 text-sm">(156)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACHADOS E PERDIDOS */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-800">Achados e Perdidos</h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8">Ajude a reunir pets com suas famílias</p>
          
          <Link href="/achados-e-perdidos" className="inline-block bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-10 py-5 rounded-xl font-bold text-lg mb-12 transition-all hover:shadow-lg">
            📢 Reportar Animal
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                ❌ PERDIDO
              </div>
              <div className="text-5xl md:text-6xl mb-6">🐕</div>
              <h3 className="text-xl md:text-2xl font-black mb-3 text-gray-800">Bolinha</h3>
              <p className="text-sm text-gray-600 mb-2">Cão - Poodle</p>
              <p className="text-sm text-gray-500">📍 Enseada, Guarujá</p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                ✓ ENCONTRADO
              </div>
              <div className="text-5xl md:text-6xl mb-6">🐈</div>
              <h3 className="text-xl md:text-2xl font-black mb-3 text-gray-800">Miau</h3>
              <p className="text-sm text-gray-600 mb-2">Gato - Siamês</p>
              <p className="text-sm text-gray-500">📍 Pitangueiras, Guarujá</p>
            </div>

            <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all">
              <div className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                ❌ PERDIDO
              </div>
              <div className="text-5xl md:text-6xl mb-6">🐕</div>
              <h3 className="text-xl md:text-2xl font-black mb-3 text-gray-800">Max</h3>
              <p className="text-sm text-gray-600 mb-2">Cão - Labrador</p>
              <p className="text-sm text-gray-500">📍 Astúrias, Guarujá</p>
            </div>
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">1.000+</div>
              <div className="text-base md:text-lg font-semibold opacity-90">Prestadores Ativos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">50.000+</div>
              <div className="text-base md:text-lg font-semibold opacity-90">Tutores Cadastrados</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">10.000+</div>
              <div className="text-base md:text-lg font-semibold opacity-90">Pets Reunidos</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">15.000+</div>
              <div className="text-base md:text-lg font-semibold opacity-90">Avaliações Reais</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              É um Prestador de Serviços?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95">
              Cadastre-se gratuitamente e conecte-se com milhares de tutores
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">📈</div>
                <div className="font-bold">Mais Visibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">💰</div>
                <div className="font-bold">100% Gratuito</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-2">⭐</div>
                <div className="font-bold">Reputação Online</div>
              </div>
            </div>

            <Link href="/cadastro" className="inline-block bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-12 py-5 rounded-xl font-black text-lg md:text-xl hover:scale-105 transition-all shadow-lg">
              Cadastrar Meu Negócio →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
