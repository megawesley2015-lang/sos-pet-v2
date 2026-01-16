"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * LostPetCard - Card de Pet Desaparecido com Interface de Resgate
 * 
 * Este componente exibe um card futurista para pets perdidos, incluindo:
 * - Overlay de escaneamento com linhas de grade neon (efeito "IA ativa")
 * - Badge de status animado (Buscando, Avistado ou Resgatado)
 * - Botão "Eu Vi Este Pet" que abre câmera e GPS
 * - Botão de compartilhamento para gerar cartaz digital
 * 
 * Props:
 * - pet: objeto com dados do pet (id, name, species, breed, etc.)
 * - onSighting: função chamada quando clica em "Eu Vi Este Pet"
 * - onShare: função chamada quando clica em "Compartilhar"
 * - onViewDetails: função chamada quando clica em "Detalhes"
 * - isAlertMode: boolean que indica se o modo de alerta está ativo
 */

// Configuração visual para cada status de resgate
// Cada status tem cores, ícones e animações específicas
const STATUS_CONFIG = {
  searching: {
    label: "Buscando",
    color: "bg-yellow-500",
    textColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/10",
    icon: "🔍",
    animation: "animate-spin-slow", // Ícone gira lentamente
  },
  sighted: {
    label: "Avistado",
    color: "bg-cyan-500",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/10",
    icon: "👁️",
    animation: "animate-pulse", // Ícone pulsa
  },
  rescued: {
    label: "Resgatado",
    color: "bg-green-500",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/10",
    icon: "✅",
    animation: "", // Sem animação (estado final)
  },
};

export default function LostPetCard({
  pet,
  onSighting,
  onShare,
  onViewDetails,
  isAlertMode = false,
}) {
  // Estado para controlar se o efeito de escaneamento está ativo
  const [isScanning, setIsScanning] = useState(true);
  // Estado para controlar se a imagem foi carregada
  const [imageLoaded, setImageLoaded] = useState(false);

  // Obtém a configuração visual baseada no status do pet
  const statusConfig = STATUS_CONFIG[pet.status];

  /**
   * Abre o modal de avistamento com câmera e GPS.
   * Essa função é chamada quando o usuário clica em "Eu Vi Este Pet".
   */
  const handleSighting = () => {
    onSighting(pet.id);
  };

  /**
   * Gera e compartilha o cartaz digital do pet.
   * Usa a Web Share API se disponível, ou abre um modal customizado.
   */
  const handleShare = () => {
    onShare(pet.id);
  };

  return (
    <div 
      className={`
        group relative rounded-2xl overflow-hidden
        transition-all duration-500
        ${isAlertMode 
          ? 'bg-slate-900/95 border-2 border-red-500/50 shadow-lg shadow-red-500/20' 
          : 'bg-slate-900/80 border border-slate-700/50 hover:border-cyan-500/30'}
      `}
    >
      {/* ========== BARRA DE STATUS NO TOPO ========== */}
      {/* Mostra o status atual: Buscando (amarelo), Avistado (cyan) ou Resgatado (verde) */}
      <div className={`
        relative flex items-center justify-between px-4 py-2
        ${statusConfig.bgColor} ${statusConfig.borderColor} border-b
      `}>
        <div className="flex items-center gap-2">
          {/* LED indicador de status (bolinha colorida com animação) */}
          <div className={`
            w-2 h-2 rounded-full ${statusConfig.color}
            ${statusConfig.animation}
          `} />
          {/* Texto do status */}
          <span className={`text-sm font-bold ${statusConfig.textColor}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
        
        {/* Contador de avistamentos (se houver) */}
        {pet.sightings && pet.sightings > 0 && (
          <span className="text-xs text-gray-400">
            {pet.sightings} avistamento{pet.sightings > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ========== ÁREA DA FOTO COM OVERLAY DE ESCANEAMENTO ========== */}
      <div className="relative aspect-square overflow-hidden">
        {/* Imagem do pet */}
        {pet.photoUrl ? (
          // Se tem foto, usa o componente Image do Next.js para otimização
          <Image
            src={pet.photoUrl}
            alt={pet.name}
            fill
            className={`
              object-cover transition-all duration-500
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          // Se não tem foto, mostra um placeholder com emoji
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-6xl opacity-50">
              {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐈' : '🐾'}
            </span>
          </div>
        )}

        {/* ========== OVERLAY DE ESCANEAMENTO (EFEITO DE IA) ========== */}
        {/* Só aparece se isScanning=true E o pet não foi resgatado */}
        {isScanning && pet.status !== 'rescued' && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Grade de escaneamento 8x8 */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
              {/* Cria 64 células com bordas sutis */}
              {Array.from({ length: 64 }).map((_, i) => (
                <div 
                  key={i} 
                  className="border border-cyan-500/10"
                />
              ))}
            </div>

            {/* Linha de varredura horizontal (move de cima para baixo) */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: 'scanY 3s linear infinite',
              }}
            />

            {/* Linha de varredura vertical (move da esquerda para direita) */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              style={{
                animation: 'scanX 4s linear infinite',
              }}
            />

            {/* Cantos de foco estilo scanner/câmera */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-cyan-400/70 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-cyan-400/70 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-cyan-400/70 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-cyan-400/70 rounded-br-lg" />

            {/* Badge "IA ATIVA" no canto superior direito */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-mono">IA ATIVA</span>
            </div>
          </div>
        )}

        {/* Gradiente escuro na parte inferior (para legibilidade) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* ========== INFORMAÇÕES DO PET ========== */}
      <div className="p-4">
        {/* Nome e características básicas */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-white text-lg">{pet.name}</h3>
            <p className="text-gray-400 text-sm">
              {pet.breed || pet.species} {pet.color && `• ${pet.color}`}
            </p>
          </div>
          {/* Badge de tamanho */}
          {pet.size && (
            <span className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-400">
              {pet.size}
            </span>
          )}
        </div>

        {/* Última localização conhecida */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-red-400">📍</span>
          <div>
            <p className="text-gray-300">{pet.lastSeenLocation}</p>
            <p className="text-gray-500 text-xs">{pet.lastSeenDate}</p>
          </div>
        </div>

        {/* Descrição do pet (truncada em 2 linhas) */}
        {pet.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {pet.description}
          </p>
        )}

        {/* ========== BOTÕES DE AÇÃO ========== */}
        <div className="space-y-2">
          {/* Botão principal: "Eu Vi Este Pet" */}
          {/* Só aparece se o pet NÃO foi resgatado */}
          {pet.status !== 'rescued' && (
            <button
              onClick={handleSighting}
              className="
                w-full py-3 rounded-xl font-bold text-white
                bg-gradient-to-r from-cyan-500 to-cyan-600
                hover:from-cyan-600 hover:to-cyan-700
                transition-all hover:scale-[1.02] active:scale-[0.98]
                flex items-center justify-center gap-2
                shadow-lg shadow-cyan-500/25
              "
            >
              <span>👁️</span>
              Eu Vi Este Pet!
              <span className="text-xs opacity-70">📷 + 📍</span>
            </button>
          )}

          {/* Botões secundários em grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Compartilhar */}
            <button
              onClick={handleShare}
              className="
                py-2 rounded-xl font-medium text-gray-300
                bg-slate-800 hover:bg-slate-700
                border border-slate-700 hover:border-slate-600
                transition-all flex items-center justify-center gap-2
              "
            >
              <span>📤</span>
              Compartilhar
            </button>

            {/* Ver detalhes */}
            <button
              onClick={() => onViewDetails(pet.id)}
              className="
                py-2 rounded-xl font-medium text-gray-300
                bg-slate-800 hover:bg-slate-700
                border border-slate-700 hover:border-slate-600
                transition-all flex items-center justify-center gap-2
              "
            >
              <span>ℹ️</span>
              Detalhes
            </button>
          </div>

          {/* Mensagem de sucesso quando resgatado */}
          {pet.status === 'rescued' && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
              <span className="text-green-400 text-sm">
                🎉 Este pet foi resgatado com sucesso!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ========== ESTILOS CSS CUSTOMIZADOS ========== */}
      <style jsx>{`
        /* Animação de varredura vertical (de cima para baixo) */
        @keyframes scanY {
          0% { top: 0; }
          100% { top: 100%; }
        }
        /* Animação de varredura horizontal (da esquerda para direita) */
        @keyframes scanX {
          0% { left: 0; }
          100% { left: 100%; }
        }
        /* Animação de rotação lenta (para o ícone de "Buscando") */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
