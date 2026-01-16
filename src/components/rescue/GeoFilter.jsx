"use client";

import { useState, useEffect } from "react";

/**
 * GeoFilter - Filtros Geográficos Inteligentes
 * 
 * Este componente permite ao usuário selecionar o raio de busca para os alertas.
 * Mostra visualmente a área de cobertura e estatísticas de quantas pessoas/locais
 * serão notificados em cada raio.
 * 
 * Props:
 * - selectedRadius: número (5, 10, 50) ou "city" para cidade toda
 * - onRadiusChange: função chamada quando o raio é alterado
 * - stats: objeto com { users, clinics, shelters } - contagens de cobertura
 * - userCity: string com o nome da cidade do usuário
 * - isLoading: boolean para mostrar estado de carregamento
 * 
 * Conceito de design:
 * - Os botões simulam "níveis de alcance" de um radar
 * - O mini mapa mostra visualmente a expansão do raio
 * - As estatísticas dão feedback concreto sobre o impacto da escolha
 */

// Opções de raio disponíveis
// Cada opção tem valor, label, ícone e descrição
const RADIUS_OPTIONS = [
  { 
    value: 5, 
    label: "5 km", 
    icon: "📍", 
    description: "Vizinhança imediata" 
  },
  { 
    value: 10, 
    label: "10 km", 
    icon: "🏘️", 
    description: "Bairros próximos" 
  },
  { 
    value: 50, 
    label: "50 km", 
    icon: "🌆", 
    description: "Região metropolitana" 
  },
  { 
    value: "city", 
    label: "Minha Cidade", 
    icon: "🏙️", 
    description: "Cobertura total" 
  },
];

export default function GeoFilter({
  selectedRadius,
  onRadiusChange,
  stats = { users: 0, clinics: 0, shelters: 0 },
  userCity = "Santos",
  isLoading = false,
}) {
  // Estado local para animar os números quando mudam
  const [animatedStats, setAnimatedStats] = useState(stats);
  // Estado para controlar a animação de expansão do círculo
  const [isExpanding, setIsExpanding] = useState(false);

  /**
   * Efeito que anima a transição quando as estatísticas mudam.
   * Primeiro, ativa o estado de "expandindo" para dar feedback visual,
   * depois atualiza os números após um pequeno delay.
   */
  useEffect(() => {
    setIsExpanding(true);
    
    // Após 300ms, atualiza os números e desativa a animação
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
      setIsExpanding(false);
    }, 300);
    
    // Cleanup: cancela o timer se o componente for desmontado
    return () => clearTimeout(timer);
  }, [stats]);

  /**
   * Manipula a seleção de um novo raio.
   * Só chama onRadiusChange se o valor for diferente do atual.
   */
  const handleSelect = (radius) => {
    if (radius !== selectedRadius) {
      onRadiusChange(radius);
    }
  };

  return (
    <div className="space-y-4">
      {/* ========== HEADER ========== */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold flex items-center gap-2">
          {/* Ícone decorativo com gradiente */}
          <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-sm">
            🎯
          </span>
          Raio de Busca
        </h3>
        
        {/* Indicador de carregamento */}
        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-sm">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            Atualizando...
          </div>
        )}
      </div>

      {/* ========== BOTÕES DE SELEÇÃO DE RAIO ========== */}
      {/* Grid de 4 colunas com os botões de raio */}
      <div className="grid grid-cols-4 gap-2">
        {RADIUS_OPTIONS.map((option) => {
          // Verifica se este botão está selecionado
          const isSelected = selectedRadius === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                relative p-3 rounded-xl transition-all duration-300
                ${isSelected 
                  // Estilo quando selecionado: gradiente cyan, sombra, escala maior
                  ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 scale-105' 
                  // Estilo quando não selecionado: fundo escuro, borda sutil
                  : 'bg-slate-800/80 text-gray-400 hover:bg-slate-700 hover:text-white border border-slate-700'}
              `}
            >
              {/* Efeito de onda brilhante quando selecionado */}
              {isSelected && (
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      animation: 'wave 2s linear infinite',
                    }}
                  />
                </div>
              )}
              
              {/* Conteúdo do botão */}
              <div className="relative flex flex-col items-center gap-1">
                <span className="text-xl">{option.icon}</span>
                <span className="font-bold text-sm">{option.label}</span>
                {/* Descrição só aparece em telas maiores */}
                <span className="text-[10px] opacity-70 hidden sm:block">
                  {/* Se for "city", mostra o nome da cidade do usuário */}
                  {option.value === "city" ? userCity : option.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========== VISUALIZAÇÃO DE COBERTURA ========== */}
      {/* Card com mini mapa e estatísticas */}
      <div className={`
        relative p-4 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700
        transition-all duration-500 
        ${isExpanding ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}
      `}>
        {/* ========== MINI MAPA ESTILIZADO ========== */}
        <div className="relative h-32 mb-4 rounded-lg overflow-hidden bg-slate-900">
          {/* Grid de "ruas" usando SVG pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Define um padrão de grade que se repete */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#06b6d4" strokeWidth="0.5"/>
                </pattern>
              </defs>
              {/* Aplica o padrão em toda a área */}
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* ========== PONTO CENTRAL (LOCALIZAÇÃO DO USUÁRIO) ========== */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Círculo de raio que expande/contrai baseado na seleção */}
              <div 
                className={`
                  absolute rounded-full border-2 border-cyan-400/50 bg-cyan-400/10
                  transition-all duration-500 ease-out
                  ${isExpanding ? 'animate-ping' : ''}
                `}
                style={{
                  // O tamanho do círculo varia conforme o raio selecionado
                  width: selectedRadius === 5 ? '40px' : 
                         selectedRadius === 10 ? '80px' : 
                         selectedRadius === 50 ? '120px' : '160px',
                  height: selectedRadius === 5 ? '40px' : 
                          selectedRadius === 10 ? '80px' : 
                          selectedRadius === 50 ? '120px' : '160px',
                  // Centraliza o círculo usando transform
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              
              {/* Ponto central (a localização exata do usuário) */}
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 relative z-10">
                {/* Efeito de ping (círculo que expande e some) */}
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50" />
              </div>
            </div>
          </div>

          {/* Pontos simulando clínicas e abrigos no mapa */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full opacity-70" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-green-400 rounded-full opacity-70" />
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-orange-400 rounded-full opacity-70" />
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-orange-400 rounded-full opacity-70" />
          
          {/* Legenda do mapa */}
          <div className="absolute bottom-2 right-2 flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Clínicas
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <span className="w-2 h-2 bg-orange-400 rounded-full" />
              Abrigos
            </span>
          </div>
        </div>

        {/* ========== ESTATÍSTICAS DE COBERTURA ========== */}
        {/* Grid de 3 colunas mostrando quantas entidades serão notificadas */}
        <div className="grid grid-cols-3 gap-3">
          {/* Tutores */}
          <div className="text-center p-2 bg-slate-900/50 rounded-lg">
            <p className="text-2xl font-black text-cyan-400">
              {/* toLocaleString adiciona separador de milhares */}
              {animatedStats.users.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">Tutores Alertados</p>
          </div>
          {/* Clínicas */}
          <div className="text-center p-2 bg-slate-900/50 rounded-lg">
            <p className="text-2xl font-black text-green-400">
              {animatedStats.clinics}
            </p>
            <p className="text-xs text-gray-400">Clínicas</p>
          </div>
          {/* Abrigos */}
          <div className="text-center p-2 bg-slate-900/50 rounded-lg">
            <p className="text-2xl font-black text-orange-400">
              {animatedStats.shelters}
            </p>
            <p className="text-xs text-gray-400">Abrigos</p>
          </div>
        </div>

        {/* Texto informativo */}
        <p className="text-center text-gray-500 text-xs mt-3">
          Todos serão notificados instantaneamente sobre o alerta
        </p>
      </div>

      {/* ========== CSS CUSTOMIZADO ========== */}
      <style jsx>{`
        /* Animação de onda que percorre o botão selecionado */
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
