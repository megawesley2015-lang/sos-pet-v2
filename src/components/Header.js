"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { logout } from "@/services/auth.service";

/**
 * Header Principal do SOS Pet
 * 
 * Estrutura de navegação:
 * - Menu principal com itens padrão
 * - Modal "Como Funciona" com 3 passos
 * - Botões de destaque: Emergência (laranja) e Sou Profissional (verde água)
 * - Menu mobile responsivo com todos os itens
 * 
 * @returns {JSX.Element}
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest(".user-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowHowItWorks(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Bloquear scroll quando menu mobile ou modal aberto
  useEffect(() => {
    if (mobileMenuOpen || showHowItWorks) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, showHowItWorks]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    window.location.href = "/";
  };

  /**
   * Abre o FAB de emergência (se existir no DOM)
   * Fallback: redireciona para prestadores com filtro de emergência
   */
  const handleEmergencyClick = useCallback(() => {
    // Tenta encontrar e clicar no FAB
    const fabButton = document.querySelector(".fab-container button");
    if (fabButton) {
      fabButton.click();
    } else {
      // Fallback: redireciona para prestadores com emergência
      window.location.href = "/prestadores?emergencia=true";
    }
    setMobileMenuOpen(false);
  }, []);

  const userName = user?.user_metadata?.nome || user?.email?.split("@")[0] || "Usuário";

  /**
   * Itens do menu principal
   */
  const menuItems = [
    { href: "/", label: "Início" },
    { href: "/achados-e-perdidos", label: "Achados e Perdidos" },
    { href: "/prestadores", label: "Serviços" },
    { href: "#", label: "Como Funciona", onClick: () => setShowHowItWorks(true) },
    { href: "/dicas", label: "Dicas" },
    { href: "/parcerias", label: "Parcerias" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <span className="text-3xl">🐾</span>
              <span className="text-2xl font-black text-[#FF6B35]">SOS Pet</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="text-gray-700 hover:text-[#20B2AA] font-semibold transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 hover:text-[#20B2AA] font-semibold transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Botão Emergência - Laranja */}
              <button
                onClick={handleEmergencyClick}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all hover:shadow-lg flex items-center gap-2"
                aria-label="Emergência 24 horas"
              >
                🚨 Emergência
              </button>

              {/* Botão Sou Profissional - Verde Água */}
              <Link
                href="/cadastro"
                className="px-4 py-2 rounded-lg bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold transition-all hover:shadow-lg"
              >
                Sou Profissional
              </Link>

              {/* Auth Area */}
              {loading ? (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-9 h-9 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/meus-pets"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🐾 Meus Pets
                      </Link>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        👤 Meu Perfil
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        🚪 Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-lg border-2 border-[#FF6B35] text-[#FF6B35] font-bold hover:bg-[#FF6B35] hover:text-white transition-all"
                >
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gray-700 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-40 transition-all duration-300 ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="h-full overflow-y-auto px-4 py-6">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left hover:bg-gray-50 font-semibold rounded-lg text-gray-700"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 hover:bg-gray-50 font-semibold rounded-lg text-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleEmergencyClick}
                className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2"
              >
                🚨 Emergência 24h
              </button>

              <Link
                href="/cadastro"
                className="block w-full py-4 rounded-xl bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold text-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sou Profissional
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/meus-pets"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🐾 Meus Pets
                  </Link>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👤 Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    🚪 Sair da conta
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-4 rounded-xl bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-bold text-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar na minha conta
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal "Como Funciona" */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHowItWorks(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-modalIn">
            {/* Close Button */}
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🐾</span>
              <h2 id="how-it-works-title" className="text-2xl md:text-3xl font-black text-gray-800">
                Como funciona o SOS Pet?
              </h2>
              <p className="text-gray-500 mt-2">Simples, rápido e feito para ajudar</p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">1. Cadastre</h3>
                <p className="text-gray-600 text-sm">
                  Registre seu pet perdido ou serviço em menos de 2 minutos
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">2. Localize</h3>
                <p className="text-gray-600 text-sm">
                  Use nossos filtros inteligentes para encontrar o que precisa
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">3. Conecte-se</h3>
                <p className="text-gray-600 text-sm">
                  Fale direto pelo WhatsApp com quem pode ajudar
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/achados-e-perdidos"
                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-bold rounded-xl text-center transition-all"
                onClick={() => setShowHowItWorks(false)}
              >
                🔍 Buscar Pet
              </Link>
              <Link
                href="/prestadores"
                className="px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl text-center transition-all"
                onClick={() => setShowHowItWorks(false)}
              >
                🏥 Ver Serviços
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
