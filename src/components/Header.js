"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { logout } from '@/services/auth.service';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Verificar sessão inicial
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const userName = user?.user_metadata?.nome || user?.email?.split('@')[0] || 'Usuário';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <span className="text-2xl font-black text-[#FF6B35]">SOS Pet</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-[#20B2AA] font-semibold transition-colors">
              Início
            </Link>
            <Link href="/prestadores" className="text-gray-700 hover:text-[#20B2AA] font-semibold transition-colors">
              Prestadores
            </Link>
            <Link href="/achados-e-perdidos" className="text-gray-700 hover:text-[#20B2AA] font-semibold transition-colors">
              Achados e Perdidos
            </Link>
          </nav>

          {/* Auth Area */}
          <div className="hidden md:flex items-center">
            {loading ? (
              <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-700">{userName}</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <Link
                      href="/meus-pets"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🐾 Meus Pets
                    </Link>
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Meu Perfil
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-7 py-3 rounded-lg bg-[#FF6B35] text-white font-bold hover:bg-[#e85a2a] transition-all hover:shadow-lg"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-gray-700 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <Link 
                href="/" 
                className="px-4 py-3 hover:bg-gray-50 font-semibold rounded-lg" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/prestadores" 
                className="px-4 py-3 hover:bg-gray-50 font-semibold rounded-lg" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Prestadores
              </Link>
              <Link 
                href="/achados-e-perdidos" 
                className="px-4 py-3 hover:bg-gray-50 font-semibold rounded-lg" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Achados e Perdidos
              </Link>
              
              <div className="mt-4 px-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold">{userName}</span>
                    </div>
                    <Link
                      href="/meus-pets"
                      className="block py-2 text-gray-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🐾 Meus Pets
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 text-red-600"
                    >
                      🚪 Sair
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    className="block py-3 bg-[#FF6B35] text-white font-bold text-center rounded-lg" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
