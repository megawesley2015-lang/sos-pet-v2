"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { logout } from "@/services/auth.service";

/**
 * Header Dark Theme - SOS Pet
 * 
 * Header com tema escuro/transparente para combinar com a landing page premium.
 * Suporta scroll-based transparency e animações suaves.
 * 
 * @returns {JSX.Element}
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para mudar transparência do header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleEmergencyClick = useCallback(() => {
    const fabButton = document.querySelector(".fab-container button");
    if (fabButton) {
      fabButton.click();
    } else {
      window.location.href = "/prestadores?emergencia24h=true";
    }
    setMobileMenuOpen(false);
  }, []);

  const userName = user?.user_metadata?.nome || user?.email?.split("@")[0] || "Usuário";

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
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">🐾</span>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                SOS Pet
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-300 hover:text-white font-medium transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )
              ))}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Botão Emergência */}
              <button
                onClick={handleEmergencyClick}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold transition-all hover:shadow-lg hover:shadow-orange-500/25 flex items-center gap-2"
                aria-label="Emergência 24 horas"
              >
                🚨 Emergência
              </button>

              {/* Botão Sou Profissional */}
              <Link
                href="/cadastro"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold transition-all hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Sou Profissional
              </Link>

              {/* Auth Area */}
              {loading ? (
                <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-all"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-lg border border-slate-700 py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="font-semibold text-white">{userName}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/meus-pets"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🐾 Meus Pets
                      </Link>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        👤 Meu Perfil
                      </Link>
                      <Link
                        href="/dashboard-prestador"
                        className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setDropdownOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10"
                      >
                        🚪 Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-white font-medium hover:bg-slate-800/50 transition-all"
                >
                  Entrar
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-24 h-full overflow-y-auto">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.onClick();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left hover:bg-slate-800 font-semibold rounded-lg text-gray-300 hover:text-white"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 hover:bg-slate-800 font-semibold rounded-lg text-gray-300 hover:text-white"
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
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg flex items-center justify-center gap-2"
              >
                🚨 Emergência 24h
              </button>

              <Link
                href="/cadastro"
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sou Profissional
              </Link>
            </div>

            {/* Mobile Auth */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{userName}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/meus-pets"
                    className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    🐾 Meus Pets
                  </Link>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👤 Meu Perfil
                  </Link>
                  <Link
                    href="/dashboard-prestador"
                    className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-slate-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    🚪 Sair da conta
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Entrar na minha conta
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal "Como Funciona" - Dark Theme */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHowItWorks(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-modalIn">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-purple-500 to-cyan-500 rounded-3xl opacity-20 blur-xl -z-10"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-5xl mb-4 block">🐾</span>
              <h2 id="how-it-works-title" className="text-2xl md:text-3xl font-black text-white">
                Como funciona o <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">SOS Pet</span>?
              </h2>
              <p className="text-gray-400 mt-2">Simples, rápido e feito para ajudar</p>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">1. Cadastre</h3>
                <p className="text-gray-400 text-sm">
                  Registre seu pet perdido ou serviço em menos de 2 minutos
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">2. Localize</h3>
                <p className="text-gray-400 text-sm">
                  Use nossos filtros inteligentes para encontrar o que precisa
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">3. Conecte-se</h3>
                <p className="text-gray-400 text-sm">
                  Fale direto pelo WhatsApp com quem pode ajudar
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/achados-e-perdidos"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl text-center transition-all"
                onClick={() => setShowHowItWorks(false)}
              >
                🔍 Buscar Pet
              </Link>
              <Link
                href="/prestadores"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl text-center transition-all"
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
