"use client";

import { useState, useEffect } from "react";

/**
 * ServiceCard - Card de Serviço com Dashboard de Comando
 * 
 * Features:
 * - LED de disponibilidade (verde/amarelo/vermelho)
 * - Micro-animações nos ícones
 * - Mini-calendário flutuante
 * - Sugestão de horário por "IA"
 * - Barra de progresso em tempo real
 * - Zonas visuais (Essencial/Lifestyle)
 */

// Configuração das animações por tipo de serviço
const SERVICE_ANIMATIONS = {
  veterinario: "animate-heartbeat",
  banho: "animate-bubbles",
  passeio: "animate-walk",
  hotel: "animate-sleep",
  adestramento: "animate-bounce-subtle",
  default: "animate-pulse-subtle"
};

// Status de disponibilidade
const AVAILABILITY_STATUS = {
  available: { color: "bg-green-500", shadow: "shadow-green-500/50", label: "Disponível Agora" },
  soon: { color: "bg-yellow-500", shadow: "shadow-yellow-500/50", label: "Próxima vaga em 1h" },
  busy: { color: "bg-red-500", shadow: "shadow-red-500/50", label: "Lotado Hoje" }
};

export default function ServiceCard({
  service = {},
  zone = "essential", // "essential" ou "lifestyle"
  availability = "available",
  aiSuggestedTime = null,
  inProgress = null, // Objeto com status atual se em andamento
  onSchedule = () => {},
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(aiSuggestedTime);

  const {
    id,
    name = "Serviço",
    icon = "🐾",
    type = "default",
    price = "R$ 50",
    duration = "1h",
    description = "Descrição do serviço"
  } = service;

  const statusConfig = AVAILABILITY_STATUS[availability];
  const animationClass = SERVICE_ANIMATIONS[type] || SERVICE_ANIMATIONS.default;
  
  // Cores baseadas na zona
  const zoneColors = zone === "essential" 
    ? { gradient: "from-cyan-500 to-blue-600", border: "border-cyan-500/30", glow: "cyan" }
    : { gradient: "from-orange-500 to-purple-600", border: "border-orange-500/30", glow: "orange" };

  // Gerar horários disponíveis (simulação)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 18) slots.push(`${hour}:30`);
    }
    return slots;
  };

  // Gerar próximos 7 dias
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule({ service, date: selectedDate, time: selectedTime });
      setShowCalendar(false);
    }
  };

  // Componente de progresso em tempo real
  const ProgressTracker = ({ status }) => {
    const steps = [
      { id: "coleta", label: "Coleta", icon: "🚗" },
      { id: "servico", label: status.currentStep || "Banho", icon: "🛁" },
      { id: "secagem", label: "Secagem", icon: "💨" },
      { id: "pronto", label: "Pronto", icon: "✨" }
    ];

    return (
      <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Status em Tempo Real</span>
          <span className="flex items-center gap-1 text-green-400 text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            AO VIVO
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = steps.findIndex(s => s.id === status.currentStepId) >= index;
            const isCurrent = step.id === status.currentStepId;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-lg
                  transition-all duration-500
                  ${isActive 
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/50' 
                    : 'bg-slate-700'}
                  ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : ''}
                `}>
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"></div>
                  )}
                  <span className="relative">{step.icon}</span>
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                
                {/* Linha conectora */}
                {index < steps.length - 1 && (
                  <div className="absolute h-0.5 w-full top-5 left-1/2">
                    <div className={`h-full transition-all duration-500 ${isActive ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {status.estimatedCompletion && (
          <p className="text-center text-sm text-gray-400 mt-3">
            Previsão de conclusão: <span className="text-cyan-400 font-medium">{status.estimatedCompletion}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="group relative">
      {/* Glow effect baseado na zona */}
      <div className={`
        absolute -inset-0.5 bg-gradient-to-r ${zoneColors.gradient} 
        rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-500
      `}></div>
      
      {/* Card principal */}
      <div className={`
        relative bg-slate-900/80 backdrop-blur-xl border ${zoneColors.border}
        rounded-2xl p-6 transition-all duration-300 group-hover:border-transparent
      `}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Ícone com animação */}
            <div className={`
              relative w-14 h-14 bg-gradient-to-br ${zoneColors.gradient}
              rounded-xl flex items-center justify-center shadow-lg
            `}>
              <span className={`text-2xl ${animationClass}`}>{icon}</span>
            </div>
            
            <div>
              <h3 className="font-bold text-white text-lg">{name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-sm">{duration}</span>
                <span className="text-gray-600">•</span>
                <span className="text-white font-bold text-sm">{price}</span>
              </div>
            </div>
          </div>
          
          {/* LED de disponibilidade */}
          <div className="flex flex-col items-end gap-1">
            <div className={`
              w-3 h-3 rounded-full ${statusConfig.color} ${statusConfig.shadow}
              shadow-lg animate-pulse
            `}></div>
            <span className="text-xs text-gray-400">{statusConfig.label}</span>
          </div>
        </div>

        {/* Descrição */}
        <p className="text-gray-400 text-sm mb-4">{description}</p>

        {/* Se em progresso, mostrar tracker */}
        {inProgress ? (
          <ProgressTracker status={inProgress} />
        ) : (
          <>
            {/* Sugestão de IA */}
            {aiSuggestedTime && !showCalendar && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">🤖</span>
                    <span className="text-sm text-gray-300">Horário Sugerido pela IA</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{aiSuggestedTime}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Baseado na rotina do seu pet e condições climáticas
                </p>
              </div>
            )}

            {/* Mini-calendário flutuante */}
            {showCalendar ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Seleção de data */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Selecione o dia</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {generateDates().map((date, i) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
                      const dayNum = date.getDate();
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={`
                            flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center
                            transition-all ${isSelected 
                              ? `bg-gradient-to-br ${zoneColors.gradient} text-white` 
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}
                          `}
                        >
                          <span className="text-xs uppercase">{dayName}</span>
                          <span className="text-lg font-bold">{dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seleção de horário */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Selecione o horário</label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                    {generateTimeSlots().map((time) => {
                      const isSelected = selectedTime === time;
                      const isAiSuggested = time === aiSuggestedTime;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            relative py-2 px-3 rounded-lg text-sm font-medium transition-all
                            ${isSelected 
                              ? `bg-gradient-to-r ${zoneColors.gradient} text-white` 
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'}
                          `}
                        >
                          {time}
                          {isAiSuggested && !isSelected && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="flex-1 py-3 rounded-xl font-medium text-gray-400 bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedDate || !selectedTime}
                    className={`
                      flex-1 py-3 rounded-xl font-bold text-white transition-all
                      bg-gradient-to-r ${zoneColors.gradient}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      hover:shadow-lg hover:scale-[1.02]
                    `}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            ) : (
              /* Botão de agendamento */
              <button
                onClick={() => setShowCalendar(true)}
                disabled={availability === 'busy'}
                className={`
                  relative w-full py-3 rounded-xl font-bold text-white overflow-hidden
                  bg-gradient-to-r ${zoneColors.gradient}
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                  group/btn
                `}
              >
                {/* Brilho animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                
                <span className="relative flex items-center justify-center gap-2">
                  <span>📅</span>
                  Agendamento Turbo
                </span>
              </button>
            )}

            {/* Botão de pagamento (após agendar) */}
            {selectedDate && selectedTime && !showCalendar && (
              <button className="w-full mt-3 py-2 rounded-xl text-sm font-medium text-gray-300 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2">
                <span>💳</span>
                Pagamento via App
                <span className="text-xs text-gray-500">• Pix ou Cartão</span>
              </button>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes bubbles {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bubbles {
          animation: bubbles 2s ease-in-out infinite;
        }
        @keyframes walk {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
        }
        .animate-walk {
          animation: walk 1s ease-in-out infinite;
        }
        @keyframes sleep {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-sleep {
          animation: sleep 3s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce 2s ease-in-out infinite;
        }
        .animate-pulse-subtle {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
