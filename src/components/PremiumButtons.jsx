"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Botão Premium para "Meus Pets"
 * Design tecnológico com anéis orbitais e efeito hover
 */
export function MeusPetsButton({ size = "default" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizes = {
    small: { container: "w-32 h-32", paw: "w-12 h-12", ring1: "w-28 h-28", ring2: "w-24 h-24" },
    default: { container: "w-40 h-40", paw: "w-16 h-16", ring1: "w-36 h-36", ring2: "w-32 h-32" },
    large: { container: "w-48 h-48", paw: "w-20 h-20", ring1: "w-44 h-44", ring2: "w-40 h-40" }
  };
  
  const s = sizes[size];

  return (
    <Link 
      href="/meus-pets"
      className="relative group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow externo */}
      <div className={`absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'opacity-100 scale-110' : 'opacity-50'}`}></div>
      
      {/* Container principal */}
      <div className={`relative ${s.container} flex items-center justify-center`}>
        
        {/* Anel orbital externo */}
        <div className={`absolute ${s.ring1} rounded-full border border-cyan-500/30 animate-spin-slower`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-cyan-400/50 rounded-full"></div>
        </div>
        
        {/* Anel orbital interno */}
        <div className={`absolute ${s.ring2} rounded-full border border-cyan-500/20 animate-spin-slow-reverse`}>
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-400 rounded-full shadow-lg shadow-orange-400/80"></div>
        </div>
        
        {/* Botão central */}
        <div className={`relative ${s.paw} rounded-full bg-gradient-to-b from-slate-700/90 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-2xl shadow-cyan-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/40`}>
          
          {/* Scan effect on hover */}
          <div className={`absolute inset-0 rounded-full overflow-hidden ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent animate-scan"></div>
          </div>
          
          {/* Paw icon */}
          <svg className="w-8 h-8 md:w-10 md:h-10 relative z-10" viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="65" rx="16" ry="13" fill="url(#pawGrad1)" />
            <ellipse cx="30" cy="48" rx="9" ry="11" fill="url(#pawGrad1)" />
            <ellipse cx="70" cy="48" rx="9" ry="11" fill="url(#pawGrad1)" />
            <ellipse cx="38" cy="30" rx="7" ry="9" fill="url(#pawGrad1)" />
            <ellipse cx="62" cy="30" rx="7" ry="9" fill="url(#pawGrad1)" />
            <defs>
              <linearGradient id="pawGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-4">
        <p className="text-white font-bold text-sm md:text-base">Meus Pets</p>
        <p className="text-gray-400 text-xs">Perfil digital</p>
      </div>
    </Link>
  );
}

/**
 * Botão Premium para "Achados e Perdidos"
 * Design de radar/alerta com pulso vermelho
 */
export function AchadosPerdidosButton({ size = "default" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const sizes = {
    small: { container: "w-32 h-32", icon: "w-12 h-12", ring1: "w-28 h-28", ring2: "w-24 h-24" },
    default: { container: "w-40 h-40", icon: "w-16 h-16", ring1: "w-36 h-36", ring2: "w-32 h-32" },
    large: { container: "w-48 h-48", icon: "w-20 h-20", ring1: "w-44 h-44", ring2: "w-40 h-40" }
  };
  
  const s = sizes[size];

  return (
    <Link 
      href="/achados-e-perdidos"
      className="relative group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow externo vermelho */}
      <div className={`absolute inset-0 bg-red-500/20 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'opacity-100 scale-110' : 'opacity-50'}`}></div>
      
      {/* Container principal */}
      <div className={`relative ${s.container} flex items-center justify-center`}>
        
        {/* Anel de pulso (radar effect) */}
        <div className={`absolute ${s.ring1} rounded-full border-2 border-red-500/30 animate-ping-slow`}></div>
        
        {/* Anel orbital com pontos */}
        <div className={`absolute ${s.ring1} rounded-full border border-red-500/20`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/80 animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Anel interno */}
        <div className={`absolute ${s.ring2} rounded-full border border-orange-500/30 animate-spin-slow`}>
          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
        </div>
        
        {/* Botão central */}
        <div className={`relative ${s.icon} rounded-full bg-gradient-to-b from-slate-700/90 to-slate-900 border border-red-500/40 flex items-center justify-center shadow-2xl shadow-red-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-red-400/60 group-hover:shadow-red-400/40`}>
          
          {/* Alert pulse effect */}
          <div className={`absolute inset-0 rounded-full bg-red-500/20 ${isHovered ? 'animate-pulse' : ''}`}></div>
          
          {/* Radar icon */}
          <div className="relative z-10 text-2xl md:text-3xl">🚨</div>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-4">
        <p className="text-white font-bold text-sm md:text-base">Achados e Perdidos</p>
        <p className="text-red-400 text-xs animate-pulse">Mapa em tempo real</p>
      </div>
    </Link>
  );
}

/**
 * Botão Premium para "Emergência 24h"
 * Design de urgência com cruz médica
 */
export function Emergencia24hButton({ size = "default" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href="/prestadores?emergencia24h=true"
      className="relative group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow verde */}
      <div className={`absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'opacity-100 scale-110' : 'opacity-50'}`}></div>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Heartbeat ring */}
        <div className={`absolute w-36 h-36 rounded-full border-2 border-emerald-500/30 ${isHovered ? 'animate-ping-slow' : ''}`}></div>
        
        {/* Orbital ring */}
        <div className="absolute w-32 h-32 rounded-full border border-emerald-500/20 animate-spin-slow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/80"></div>
        </div>
        
        {/* Botão central */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-slate-700/90 to-slate-900 border border-emerald-500/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400/60">
          
          {/* Cross icon */}
          <div className="relative z-10">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
              <path d="M12 4v16M4 12h16" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-white font-bold">Emergência 24h</p>
        <p className="text-emerald-400 text-xs">Atendimento imediato</p>
      </div>
    </Link>
  );
}

/**
 * Botão Premium para "Serviços"
 * Design de busca/explorar
 */
export function ServicosButton({ size = "default" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      href="/prestadores"
      className="relative group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow roxo */}
      <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'opacity-100 scale-110' : 'opacity-50'}`}></div>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        
        {/* Search wave effect */}
        <div className={`absolute w-36 h-36 rounded-full border border-purple-500/30 ${isHovered ? 'animate-ping-slow' : ''}`}></div>
        
        {/* Orbital */}
        <div className="absolute w-32 h-32 rounded-full border border-purple-500/20 animate-spin-slower">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
        </div>
        
        {/* Botão central */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-slate-700/90 to-slate-900 border border-purple-500/40 flex items-center justify-center shadow-2xl shadow-purple-500/20 transition-all duration-300 group-hover:scale-110 group-hover:border-purple-400/60">
          <div className="relative z-10 text-2xl">🔍</div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-white font-bold">Serviços</p>
        <p className="text-purple-400 text-xs">Vet, pet shop, hotel...</p>
      </div>
    </Link>
  );
}

/**
 * Grid de botões premium para usar em qualquer página
 */
export function PremiumButtonsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
      <MeusPetsButton />
      <AchadosPerdidosButton />
      <Emergencia24hButton />
      <ServicosButton />
    </div>
  );
}

/**
 * CSS necessário para as animações
 * Adicione isso ao seu globals.css ou na tag <style> da página
 */
export const premiumButtonsCSS = `
  @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spin-slower { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  @keyframes ping-slow { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 0.3; } }
  @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
  
  .animate-spin-slow { animation: spin-slow 15s linear infinite; }
  .animate-spin-slower { animation: spin-slower 25s linear infinite; }
  .animate-spin-slow-reverse { animation: spin-slow-reverse 20s linear infinite; }
  .animate-ping-slow { animation: ping-slow 2s ease-in-out infinite; }
  .animate-scan { animation: scan 2s ease-in-out infinite; }
`;
