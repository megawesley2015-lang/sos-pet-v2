"use client";

import { useState, useCallback } from "react";
import SOSButton from "@/components/rescue/SOSButton";
import LostPetCard from "@/components/rescue/LostPetCard";
import GeoFilter from "@/components/rescue/GeoFilter";
import SightingModal from "@/components/rescue/SightingModal";

/**
 * Central de Comando de Resgate - SOS Pet
 * Página principal para busca e resgate de pets perdidos
 */

// Dados mock - substituir por query Supabase em produção
const MOCK_LOST_PETS = [
  {
    id: "1",
    name: "Thor",
    species: "dog",
    breed: "Golden Retriever",
    color: "Dourado",
    size: "Grande",
    lastSeenLocation: "Praia do Gonzaga, Santos - SP",
    lastSeenDate: "Há 2 horas",
    photoUrl: null,
    description: "Muito dócil, usa coleira azul. Responde pelo nome.",
    status: "searching",
    sightings: 0,
  },
  {
    id: "2",
    name: "Mel",
    species: "cat",
    breed: "Siamês",
    color: "Branco e marrom",
    size: "Pequeno",
    lastSeenLocation: "Rua Conselheiro Nébias, 200",
    lastSeenDate: "Há 5 horas",
    photoUrl: null,
    description: "Gata tímida. Tem olhos azuis.",
    status: "sighted",
    sightings: 2,
  },
  {
    id: "3",
    name: "Bob",
    species: "dog",
    breed: "Vira-lata",
    color: "Caramelo",
    size: "Médio",
    lastSeenLocation: "Av. Ana Costa, Santos",
    lastSeenDate: "Ontem às 18h",
    photoUrl: null,
    description: "Brincalhão, adora crianças. Sem coleira.",
    status: "searching",
    sightings: 1,
  },
  {
    id: "4",
    name: "Luna",
    species: "dog",
    breed: "Shih Tzu",
    color: "Branco e cinza",
    size: "Pequeno",
    lastSeenLocation: "Bairro Embaré, Santos",
    lastSeenDate: "Há 1 dia",
    photoUrl: null,
    description: "Tosada, carinhosa. Usa laço rosa.",
    status: "rescued",
    sightings: 5,
  },
];

// Estatísticas por raio
const getStatsByRadius = (radius: number | string) => {
  const statsMap: Record<number | string, { users: number; clinics: number; shelters: number }> = {
    5: { users: 320, clinics: 2, shelters: 1 },
    10: { users: 850, clinics: 5, shelters: 2 },
    50: { users: 2400, clinics: 15, shelters: 6 },
    city: { users: 4200, clinics: 22, shelters: 9 },
  };
  return statsMap[radius] || statsMap[10];
};

export default function AchadosEPerdidosPage() {
  // Estados principais
  const [alertMode, setAlertMode] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState<number | string>(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState(getStatsByRadius(10));
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Modal de avistamento
  const [sightingModal, setSightingModal] = useState<{ isOpen: boolean; petId: string | null }>({ isOpen: false, petId: null });

  // Pets filtrados
  const filteredPets = MOCK_LOST_PETS.filter(pet => 
    filterStatus === "all" || pet.status === filterStatus
  );

  // Pet selecionado para modal
  const selectedPet = sightingModal.petId 
    ? MOCK_LOST_PETS.find(p => p.id === sightingModal.petId)
    : null;

  // Handlers
  const handleRadiusChange = useCallback((radius: number | string) => {
    setIsLoadingStats(true);
    setSelectedRadius(radius);
    setTimeout(() => {
      setStats(getStatsByRadius(radius));
      setIsLoadingStats(false);
    }, 500);
  }, []);

  const handleAlertActivate = useCallback(() => {
    setAlertMode(true);
    console.log("🚨 Alerta ativado! Raio:", selectedRadius);
  }, [selectedRadius]);

  const handleAlertDeactivate = useCallback(() => {
    setAlertMode(false);
  }, []);

  const handleSighting = useCallback((petId: string) => {
    setSightingModal({ isOpen: true, petId });
  }, []);

  const handleSightingSubmit = useCallback(async (data: any) => {
    console.log("📸 Avistamento:", data);
    await new Promise(r => setTimeout(r, 1500));
    alert("✅ Avistamento enviado!");
  }, []);

  const handleShare = useCallback((petId: string) => {
    const pet = MOCK_LOST_PETS.find(p => p.id === petId);
    if (!pet) return;
    if (navigator.share) {
      navigator.share({
        title: `🆘 Pet Perdido: ${pet.name}`,
        text: `Ajude a encontrar ${pet.name}! Visto em ${pet.lastSeenLocation}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copiado!");
    }
  }, []);

  const handleViewDetails = useCallback((petId: string) => {
    console.log("Ver detalhes:", petId);
  }, []);

  // Opções de filtro
  const filterOptions = [
    { value: "all", label: "Todos", count: MOCK_LOST_PETS.length },
    { value: "searching", label: "Buscando", count: MOCK_LOST_PETS.filter(p => p.status === "searching").length },
    { value: "sighted", label: "Avistados", count: MOCK_LOST_PETS.filter(p => p.status === "sighted").length },
    { value: "rescued", label: "Resgatados", count: MOCK_LOST_PETS.filter(p => p.status === "rescued").length },
  ];

  return (
    <main className={`
      min-h-screen transition-all duration-500
      ${alertMode ? 'bg-gradient-to-b from-red-950 via-slate-950 to-slate-950' : 'bg-slate-950'}
    `}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[150px] transition-all duration-1000 ${alertMode ? 'bg-red-500/20' : 'bg-cyan-500/5'}`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[150px] transition-all duration-1000 ${alertMode ? 'bg-orange-500/20' : 'bg-orange-500/5'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className={`mb-8 p-6 rounded-2xl border transition-all duration-500 ${alertMode ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              {alertMode && (
                <span className="inline-flex items-center gap-2 px-3 py-1 mb-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm animate-pulse">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  MODO ALERTA ATIVO
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-white">
                Central de <span className={alertMode ? 'text-red-400' : 'text-cyan-400'}>Resgate</span>
              </h1>
              <p className="text-gray-400 mt-2">
                {alertMode ? `Rede acionada • ${stats?.users || 0} tutores alertados` : "Ajude a reunir pets com suas famílias"}
              </p>
            </div>
            <SOSButton 
              onActivate={handleAlertActivate}
              onDeactivate={handleAlertDeactivate}
              isActive={alertMode}
            />
          </div>
        </header>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <GeoFilter
              selectedRadius={selectedRadius}
              onRadiusChange={handleRadiusChange}
              stats={stats}
              userCity="Santos"
              isLoading={isLoadingStats}
            />

            {/* Filtro Status */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>📋</span> Filtrar por Status
              </h3>
              <div className="space-y-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      filterStatus === filter.value
                        ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                        : 'bg-slate-800/50 border border-transparent text-gray-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="text-sm bg-slate-700 px-2 py-0.5 rounded">{filter.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Cadastrar */}
            <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25">
              <span className="text-xl">➕</span>
              Cadastrar Pet Perdido
            </button>
          </aside>

          {/* Grid de Pets */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {filterStatus === "all" ? "Todos os Pets" : 
                 filterStatus === "searching" ? "Pets em Busca" :
                 filterStatus === "sighted" ? "Pets Avistados" : "Pets Resgatados"}
                <span className="text-gray-400 font-normal ml-2">({filteredPets.length})</span>
              </h2>
              <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-white text-sm focus:border-cyan-500 outline-none">
                <option>Mais recentes</option>
                <option>Mais próximos</option>
                <option>Com avistamentos</option>
              </select>
            </div>

            {filteredPets.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPets.map((pet, index) => (
                  <div key={pet.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                    <LostPetCard
                      pet={pet}
                      onSighting={handleSighting}
                      onShare={handleShare}
                      onViewDetails={handleViewDetails}
                      isAlertMode={alertMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-white mb-2">Nenhum pet encontrado</h3>
                <p className="text-gray-400">Não há pets com o status selecionado.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* FAB - Cadastrar */}
      <button className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-40 group">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-red-400 animate-ping opacity-20" />
        <span className="relative">➕</span>
        <span className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Cadastrar Pet Perdido
        </span>
      </button>

      {/* Modal de Avistamento */}
      {selectedPet && (
        <SightingModal
          isOpen={sightingModal.isOpen}
          onClose={() => setSightingModal({ isOpen: false, petId: null })}
          onSubmit={handleSightingSubmit}
          petInfo={{ id: selectedPet.id, name: selectedPet.name, photoUrl: selectedPet.photoUrl }}
        />
      )}

      {/* CSS Global */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
