"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/**
 * EmergencyFAB - Floating Action Button para ações rápidas de emergência
 * 
 * Arquitetura:
 * - Botão principal expande menu radial com sub-ações
 * - Animações CSS puras (sem dependências)
 * - Acessibilidade: suporte a keyboard navigation e screen readers
 * - Mobile-first: touch-friendly, área de toque 48px+
 */
export default function EmergencyFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  /**
   * Oculta FAB durante scroll para baixo, mostra no scroll para cima
   * Melhora UX em mobile evitando obstrução de conteúdo
   */
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
      setIsOpen(false);
    } else {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /**
   * Fecha menu ao clicar fora
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".fab-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  /**
   * Suporte a tecla Escape para fechar
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  /**
   * Ações do menu FAB
   * Cada ação tem: id, label, icon, href/onClick, color, ariaLabel
   */
  const actions = [
    {
      id: "emergency",
      label: "Emergência 24h",
      icon: "🚨",
      href: "/prestadores?emergencia=true",
      color: "bg-red-500 hover:bg-red-600",
      ariaLabel: "Ver clínicas veterinárias 24 horas",
    },
    {
      id: "lost",
      label: "Perdi meu pet",
      icon: "🔍",
      href: "/achados-e-perdidos/cadastrar?tipo=perdido",
      color: "bg-orange-500 hover:bg-orange-600",
      ariaLabel: "Cadastrar pet perdido",
    },
    {
      id: "found",
      label: "Encontrei um pet",
      icon: "🐾",
      href: "/achados-e-perdidos/cadastrar?tipo=encontrado",
      color: "bg-blue-500 hover:bg-blue-600",
      ariaLabel: "Cadastrar pet encontrado",
    },
    {
      id: "whatsapp",
      label: "Ajuda",
      icon: "💬",
      href: "https://wa.me/5513991234567?text=Olá! Preciso de ajuda no SOS Pet",
      color: "bg-green-500 hover:bg-green-600",
      ariaLabel: "Falar com suporte via WhatsApp",
      external: true,
    },
  ];

  return (
    <>
      {/* Overlay escuro quando menu aberto */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Container do FAB */}
      <div
        className={`fab-container fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        }`}
      >
        {/* Sub-botões (aparecem quando expandido) */}
        <div
          className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300 ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
          role="menu"
          aria-label="Menu de ações rápidas"
        >
          {actions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center justify-end gap-3"
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
            >
              {/* Label do botão */}
              <span
                className={`bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap transition-all duration-300 ${
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 50 + 100}ms` : "0ms",
                }}
              >
                {action.label}
              </span>

              {/* Botão de ação - CORRIGIDO: adicionada tag <a> */}
              {action.external ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 rounded-full ${action.color} text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2`}
                  aria-label={action.ariaLabel}
                  role="menuitem"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {action.icon}
                  </span>
                </a>
              ) : (
                <Link
                  href={action.href}
                  className={`w-14 h-14 rounded-full ${action.color} text-white flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2`}
                  aria-label={action.ariaLabel}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {action.icon}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Botão principal */}
        <button
          onClick={toggleMenu}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-red-300 ${
            isOpen
              ? "bg-gray-700 rotate-45"
              : "bg-gradient-to-br from-red-500 to-red-600 animate-pulse-slow"
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={isOpen ? "Fechar menu de emergência" : "Abrir menu de emergência"}
        >
          {isOpen ? (
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <span className="text-3xl" aria-hidden="true">
              🚨
            </span>
          )}
        </button>

        {/* Indicador de pulse quando fechado */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </div>

      {/* CSS para animação customizada */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }
      `}</style>
    </>
  );
}