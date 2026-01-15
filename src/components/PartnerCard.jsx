"use client";

import { useState } from "react";

/**
 * PartnerCard - Card de Parceiro com Glassmorphism
 * 
 * Features:
 * - Efeito de vidro fosco (glassmorphism)
 * - Borda neon no hover
 * - Selo de verificação animado
 * - Match % para o pet
 * - Botão com preenchimento gradual
 * - Contador de urgência opcional
 */

export default function PartnerCard({ 
  partner = {},
  petMatch = null, // Porcentagem de match (0-100)
  urgencyTimer = null, // Segundos restantes para oferta
  onActivate = () => {},
}) {
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const {
    name = "Parceiro",
    logo = "🏪",
    category = "Pet Shop",
    discount = "15%",
    isVerified = true,
    description = "Desconto exclusivo para membros SOS Pet"
  } = partner;

  const handleActivate = async () => {
    setIsActivating(true);
    
    // Simula geração do cupom
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsActivating(false);
    setIsActivated(true);
    onActivate(partner);
  };

  // Formata o timer de urgência
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative">
      {/* Glow effect no hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-70 blur transition-all duration-500"></div>
      
      {/* Card principal - Glassmorphism */}
      <div className="relative bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-transparent">
        
        {/* Header com logo e selo */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Logo container */}
            <div className="relative">
              <div className="w-16 h-16 bg-slate-800/80 backdrop-blur rounded-xl flex items-center justify-center border border-slate-700/50 group-hover:border-cyan-500/30 transition-colors">
                <span className="text-3xl">{logo}</span>
              </div>
              
              {/* Selo de verificação */}
              {isVerified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg">{name}</h3>
              <p className="text-gray-400 text-sm">{category}</p>
            </div>
          </div>
          
          {/* Badge de desconto */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            -{discount}
          </div>
        </div>

        {/* Descrição */}
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        {/* Match indicator (se houver) */}
        {petMatch !== null && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Match para seu Pet</span>
              <span className="text-cyan-400 font-bold">{petMatch}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{ width: `${petMatch}%` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        )}

        {/* Timer de urgência (se houver) */}
        {urgencyTimer && !isActivated && (
          <div className="mb-4 flex items-center justify-center gap-2 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">
              Oferta expira em <span className="font-mono font-bold">{formatTime(urgencyTimer)}</span>
            </span>
          </div>
        )}

        {/* Botão de ação */}
        {!isActivated ? (
          <button
            onClick={handleActivate}
            disabled={isActivating}
            className="relative w-full py-3 rounded-xl font-bold text-white overflow-hidden transition-all group/btn"
          >
            {/* Background base */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-cyan-500"></div>
            
            {/* Efeito de preenchimento no loading */}
            {isActivating && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-orange-400 animate-fill-left"></div>
            )}
            
            {/* Brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
            
            {/* Texto */}
            <span className="relative flex items-center justify-center gap-2">
              {isActivating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando Cupom...
                </>
              ) : (
                <>
                  <span>🎫</span>
                  Resgatar Vantagem
                </>
              )}
            </span>
          </button>
        ) : (
          <div className="relative w-full py-3 rounded-xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-500 text-white">
            <span className="flex items-center justify-center gap-2">
              <span>✓</span>
              Cupom Ativado!
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fill-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fill-left {
          animation: fill-left 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
