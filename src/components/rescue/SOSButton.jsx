"use client";

import { useState, useRef, useCallback } from "react";

/**
 * SOSButton - Botão de Alerta Máximo com Long Press
 * 
 * Este componente implementa o botão SOS central da Central de Resgate.
 * O usuário precisa manter pressionado por 2 segundos para ativar,
 * evitando acionamentos acidentais.
 * 
 * Props:
 * - onActivate: função chamada quando o alerta é ativado
 * - onDeactivate: função chamada quando o alerta é desativado
 * - isActive: boolean indicando se o modo alerta está ativo
 * - disabled: boolean para desabilitar o botão
 */
export default function SOSButton({
  onActivate,
  onDeactivate,
  isActive = false,
  disabled = false,
}) {
  // Estado para controlar se o botão está sendo pressionado
  const [isPressed, setIsPressed] = useState(false);
  // Estado para controlar o progresso do "long press" (0 a 100)
  const [progress, setProgress] = useState(0);
  
  // Refs para armazenar os timers (permite cancelar se o usuário soltar)
  const progressInterval = useRef(null);
  const activationTimeout = useRef(null);

  // Configurações de tempo
  const HOLD_DURATION = 2000; // 2 segundos para ativar
  const PROGRESS_INTERVAL = 20; // Atualiza a barra a cada 20ms

  /**
   * Inicia o processo de ativação quando o usuário começa a pressionar.
   * O progresso aumenta gradualmente até 100%, momento em que o alerta é ativado.
   */
  const handlePressStart = useCallback(() => {
    // Não faz nada se estiver desabilitado ou já ativo
    if (disabled || isActive) return;

    setIsPressed(true);
    setProgress(0);

    // Vibração inicial para feedback tátil (se suportado)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Incrementa o progresso gradualmente a cada 20ms
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (HOLD_DURATION / PROGRESS_INTERVAL));
        return Math.min(newProgress, 100);
      });
    }, PROGRESS_INTERVAL);

    // Ativa o alerta após 2 segundos completos
    activationTimeout.current = setTimeout(() => {
      setIsPressed(false);
      setProgress(100);
      
      // Vibração de sucesso (padrão: vibra-pausa-vibra)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Chama a função de ativação passada via props
      onActivate();
    }, HOLD_DURATION);
  }, [disabled, isActive, onActivate]);

  /**
   * Cancela a ativação se o usuário soltar antes de completar 2 segundos.
   * Isso evita acionamentos acidentais.
   */
  const handlePressEnd = useCallback(() => {
    // Limpa o intervalo de progresso
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    // Limpa o timeout de ativação
    if (activationTimeout.current) {
      clearTimeout(activationTimeout.current);
      activationTimeout.current = null;
    }

    // Reseta os estados visuais
    setIsPressed(false);
    setProgress(0);
  }, []);

  /**
   * Desativa o modo de alerta quando clicado (se já estiver ativo)
   */
  const handleDeactivate = useCallback(() => {
    if (onDeactivate) {
      onDeactivate();
    }
  }, [onDeactivate]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Texto de instrução que muda conforme o estado */}
      <p className="text-gray-400 text-sm mb-4 text-center">
        {isActive 
          ? "Modo de Alerta Ativo" 
          : isPressed 
            ? "Continue segurando..." 
            : "Segure por 2s para ativar"}
      </p>

      {/* Container do botão com efeitos de radar */}
      <div className="relative">
        {/* Ondas de radar que aparecem quando ativo ou pressionado */}
        {(isActive || isPressed) && (
          <>
            {/* Onda 1 - mais próxima */}
            <div 
              className={`
                absolute inset-0 rounded-full 
                ${isActive ? 'bg-red-500/20' : 'bg-orange-500/20'}
                animate-ping
              `} 
              style={{ animationDuration: '1.5s' }}
            />
            {/* Onda 2 - média distância */}
            <div 
              className={`
                absolute -inset-4 rounded-full 
                ${isActive ? 'bg-red-500/10' : 'bg-orange-500/10'}
                animate-ping
              `} 
              style={{ animationDuration: '2s', animationDelay: '0.5s' }}
            />
            {/* Onda 3 - mais distante */}
            <div 
              className={`
                absolute -inset-8 rounded-full 
                ${isActive ? 'bg-red-500/5' : 'bg-orange-500/5'}
                animate-ping
              `} 
              style={{ animationDuration: '2.5s', animationDelay: '1s' }}
            />
          </>
        )}

        {/* Efeito de brilho (glow) atrás do botão */}
        <div className={`
          absolute -inset-2 rounded-full blur-xl transition-all duration-300
          ${isActive 
            ? 'bg-red-500/50' 
            : isPressed 
              ? 'bg-orange-500/50' 
              : 'bg-red-500/20'}
        `} />

        {/* Botão principal */}
        <button
          // Eventos de mouse (desktop)
          onMouseDown={!isActive ? handlePressStart : undefined}
          onMouseUp={!isActive ? handlePressEnd : undefined}
          onMouseLeave={!isActive ? handlePressEnd : undefined}
          // Eventos de touch (mobile)
          onTouchStart={!isActive ? handlePressStart : undefined}
          onTouchEnd={!isActive ? handlePressEnd : undefined}
          // Clique normal para desativar
          onClick={isActive ? handleDeactivate : undefined}
          disabled={disabled}
          className={`
            relative w-32 h-32 rounded-full
            transition-all duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isActive ? 'scale-110' : isPressed ? 'scale-95' : 'hover:scale-105'}
          `}
          aria-label={isActive ? "Desativar alerta SOS" : "Ativar alerta SOS"}
        >
          {/* Fundo gradiente do botão */}
          <div className={`
            absolute inset-0 rounded-full
            ${isActive 
              ? 'bg-gradient-to-br from-red-600 via-red-500 to-orange-500' 
              : 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500'}
            ${!isActive && 'animate-pulse'}
          `} />

          {/* Anel de progresso SVG (aparece durante o long press) */}
          {isPressed && !isActive && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              {/* Círculo de fundo (trilha) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="4"
              />
              {/* Círculo de progresso (preenchimento) */}
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                // O strokeDasharray define o comprimento total
                strokeDasharray={`${2 * Math.PI * 60}`}
                // O strokeDashoffset controla quanto está preenchido
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
                className="transition-all duration-100"
              />
            </svg>
          )}

          {/* Linhas decorativas de radar */}
          <div className="absolute inset-4 rounded-full border border-white/20" />
          <div className="absolute inset-8 rounded-full border border-white/10" />

          {/* Linha de varredura giratória (quando ativo ou pressionado) */}
          {(isActive || isPressed) && (
            <div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ 
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 30deg, transparent 60deg)',
                animation: 'spin 2s linear infinite'
              }}
            />
          )}

          {/* Conteúdo central (ícone e texto) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            {isActive ? (
              <>
                <span className="text-3xl mb-1">🚨</span>
                <span className="text-xs font-bold uppercase tracking-wider">ATIVO</span>
              </>
            ) : (
              <>
                <span className="text-3xl mb-1">🆘</span>
                <span className="text-xs font-bold uppercase tracking-wider">SOS PET</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Indicador de status quando ativo */}
      {isActive && (
        <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full animate-pulse">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          <span className="text-red-400 text-sm font-medium">
            Rede de busca acionada
          </span>
        </div>
      )}

      {/* Botão de desativar (texto simples) */}
      {isActive && onDeactivate && (
        <button
          onClick={handleDeactivate}
          className="mt-4 text-gray-400 text-sm hover:text-white transition-colors"
        >
          Clique para desativar
        </button>
      )}

      {/* CSS para a animação de spin */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
