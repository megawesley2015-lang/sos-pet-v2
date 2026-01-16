"use client";

import { useState, useEffect } from "react";
import PartnerCard from "@/components/PartnerCard";
import ServiceCard from "@/components/ServiceCard";

/**
 * Página de Demonstração - Dashboard de Parcerias e Serviços
 * 
 * Esta página mostra os componentes de alta performance:
 * - Cards de parceiros com glassmorphism
 * - Cards de serviços com LED e calendário
 * - Filtros por categoria
 * - Simulação de IA e tracking em tempo real
 */

// Dados mockados de parceiros
const MOCK_PARTNERS = [
  {
    id: 1,
    name: "PetShop Premium",
    logo: "🏪",
    category: "Pet Shop",
    discount: "20%",
    isVerified: true,
    description: "Rações importadas e acessórios exclusivos com desconto especial."
  },
  {
    id: 2,
    name: "FarmaPet Santos",
    logo: "💊",
    category: "Farmácia Veterinária",
    discount: "15%",
    isVerified: true,
    description: "Medicamentos e suplementos com receita digital integrada."
  },
  {
    id: 3,
    name: "Royal Canin BR",
    logo: "👑",
    category: "Marca de Ração",
    discount: "25%",
    isVerified: true,
    description: "Nutrição premium específica para cada raça e idade."
  },
  {
    id: 4,
    name: "PetLove Express",
    logo: "🚚",
    category: "Delivery",
    discount: "Frete Grátis",
    isVerified: false,
    description: "Entrega em até 2h na Baixada Santista."
  },
];

// Dados mockados de serviços
const MOCK_SERVICES = [
  {
    id: 1,
    name: "Consulta Veterinária",
    icon: "💓",
    type: "veterinario",
    price: "R$ 150",
    duration: "30min",
    description: "Consulta completa com veterinário especializado.",
    zone: "essential"
  },
  {
    id: 2,
    name: "Banho & Tosa",
    icon: "🛁",
    type: "banho",
    price: "R$ 80",
    duration: "1h30",
    description: "Banho premium com produtos hipoalergênicos.",
    zone: "lifestyle"
  },
  {
    id: 3,
    name: "Dog Walking",
    icon: "🦮",
    type: "passeio",
    price: "R$ 45",
    duration: "1h",
    description: "Passeio monitorado com GPS em tempo real.",
    zone: "lifestyle"
  },
  {
    id: 4,
    name: "Vacinação",
    icon: "💉",
    type: "veterinario",
    price: "R$ 120",
    duration: "15min",
    description: "Vacinas essenciais com certificado digital.",
    zone: "essential"
  },
  {
    id: 5,
    name: "Hotel Pet",
    icon: "🏨",
    type: "hotel",
    price: "R$ 90/dia",
    duration: "Diária",
    description: "Hospedagem com câmeras e updates em tempo real.",
    zone: "lifestyle"
  },
  {
    id: 6,
    name: "Adestramento",
    icon: "🎓",
    type: "adestramento",
    price: "R$ 200",
    duration: "1h",
    description: "Sessão individual com certificação.",
    zone: "lifestyle"
  },
];

// Categorias de filtro para parceiros
const PARTNER_CATEGORIES = [
  { id: "all", label: "Todos", icon: "🌟" },
  { id: "nutrition", label: "Nutrição", icon: "🦴" },
  { id: "health", label: "Saúde", icon: "➕" },
  { id: "premium", label: "Premium", icon: "⭐" },
];

// Categorias de filtro para serviços
const SERVICE_ZONES = [
  { id: "all", label: "Todos", color: "from-gray-500 to-gray-600" },
  { id: "essential", label: "Essencial", color: "from-cyan-500 to-blue-600", icon: "💙" },
  { id: "lifestyle", label: "Lifestyle", color: "from-orange-500 to-purple-600", icon: "🧡" },
];

export default function DashboardPage() {
  const [activePartnerCategory, setActivePartnerCategory] = useState("all");
  const [activeServiceZone, setActiveServiceZone] = useState("all");
  const [urgencyTimers, setUrgencyTimers] = useState({ 1: 180, 3: 45 }); // IDs com timer
  const [serviceInProgress, setServiceInProgress] = useState(null);

  // Timer countdown para ofertas
  useEffect(() => {
    const interval = setInterval(() => {
      setUrgencyTimers(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key] > 0) updated[key]--;
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simular pet match baseado no parceiro
  const getPetMatch = (partnerId) => {
    const matches = { 1: 92, 2: 78, 3: 98, 4: 65 };
    return matches[partnerId] || Math.floor(Math.random() * 30) + 70;
  };

  // Simular disponibilidade dos serviços
  const getAvailability = (serviceId) => {
    const availabilities = { 1: "available", 2: "soon", 3: "available", 4: "available", 5: "busy", 6: "soon" };
    return availabilities[serviceId] || "available";
  };

  // Simular sugestão de horário por IA
  const getAiSuggestedTime = (serviceId) => {
    const suggestions = { 1: "14:30", 2: "10:00", 3: "07:00", 4: "09:00", 5: null, 6: "16:00" };
    return suggestions[serviceId];
  };

  // Filtrar parceiros
  const filteredPartners = activePartnerCategory === "all" 
    ? MOCK_PARTNERS 
    : MOCK_PARTNERS.filter(p => {
        if (activePartnerCategory === "nutrition") return p.category.includes("Ração") || p.category.includes("Pet Shop");
        if (activePartnerCategory === "health") return p.category.includes("Farmácia");
        if (activePartnerCategory === "premium") return p.isVerified;
        return true;
      });

  // Filtrar serviços
  const filteredServices = activeServiceZone === "all"
    ? MOCK_SERVICES
    : MOCK_SERVICES.filter(s => s.zone === activeServiceZone);

  // Simular início de serviço
  const handleStartDemo = () => {
    setServiceInProgress({
      currentStepId: "coleta",
      currentStep: "Coleta",
      estimatedCompletion: "15:30"
    });

    // Simular progresso
    setTimeout(() => setServiceInProgress(prev => ({ ...prev, currentStepId: "servico", currentStep: "Banho" })), 3000);
    setTimeout(() => setServiceInProgress(prev => ({ ...prev, currentStepId: "secagem", currentStep: "Secagem" })), 6000);
    setTimeout(() => setServiceInProgress(prev => ({ ...prev, currentStepId: "pronto", currentStep: "Pronto!" })), 9000);
    setTimeout(() => setServiceInProgress(null), 12000);
  };

  return (
    <main className="min-h-screen bg-slate-950 py-12">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px] animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            <span className="text-cyan-400 text-sm font-medium">Dashboard de Comando</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ecossistema <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">SOS Pet</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Parcerias exclusivas e serviços inteligentes para o bem-estar do seu pet. 
            Tudo com recomendações personalizadas por IA.
          </p>

          {/* Demo button */}
          <button
            onClick={handleStartDemo}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
          >
            🎬 Simular Serviço em Andamento
          </button>
        </header>

        {/* ========== SEÇÃO DE PARCERIAS ========== */}
        <section className="mb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-lg">🤝</span>
                Parcerias Exclusivas
              </h2>
              <p className="text-gray-400 mt-1">Benefícios personalizados para você e seu pet</p>
            </div>

            {/* Filtros de categoria */}
            <div className="flex gap-2">
              {PARTNER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActivePartnerCategory(cat.id)}
                  className={`
                    px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2
                    ${activePartnerCategory === cat.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700'}
                  `}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid de parceiros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPartners.map((partner, i) => (
              <div key={partner.id} className="animate-float" style={{ animationDelay: `${i * 100}ms` }}>
                <PartnerCard
                  partner={partner}
                  petMatch={getPetMatch(partner.id)}
                  urgencyTimer={urgencyTimers[partner.id]}
                  onActivate={(p) => console.log("Ativado:", p)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ========== SEÇÃO DE SERVIÇOS ========== */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-lg">⚡</span>
                Serviços Inteligentes
              </h2>
              <p className="text-gray-400 mt-1">Agendamento turbo com sugestões de IA</p>
            </div>

            {/* Filtros de zona */}
            <div className="flex gap-2">
              {SERVICE_ZONES.map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setActiveServiceZone(zone.id)}
                  className={`
                    px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2
                    ${activeServiceZone === zone.id
                      ? `bg-gradient-to-r ${zone.color} text-white shadow-lg`
                      : 'bg-slate-800 text-gray-400 hover:bg-slate-700 border border-slate-700'}
                  `}
                >
                  {zone.icon && <span>{zone.icon}</span>}
                  <span>{zone.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legenda das zonas */}
          <div className="flex gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
              <span className="text-gray-400">Zona Essencial - Saúde e Vacinas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-purple-600"></div>
              <span className="text-gray-400">Zona Lifestyle - Estética e Recreação</span>
            </div>
          </div>

          {/* Grid de serviços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, i) => (
              <div key={service.id} className="animate-float" style={{ animationDelay: `${i * 100}ms` }}>
                <ServiceCard
                  service={service}
                  zone={service.zone}
                  availability={getAvailability(service.id)}
                  aiSuggestedTime={getAiSuggestedTime(service.id)}
                  inProgress={service.id === 2 ? serviceInProgress : null}
                  onSchedule={(data) => console.log("Agendado:", data)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="mt-20">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 text-center">
              <div className="inline-block mb-6">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 via-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-4">
                Quer ser um <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">Parceiro Premium</span>?
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Escale seu negócio pet através da nossa plataforma inteligente. 
                Alcance milhares de tutores na Baixada Santista.
              </p>
              
              <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
                Seja um Parceiro →
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
