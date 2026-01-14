"use client";

import Link from "next/link";

/**
 * Footer Principal do SOS Pet
 * 
 * Seções:
 * - Logo e descrição
 * - Links de navegação
 * - Links legais
 * - Redes sociais
 * - Copyright
 * 
 * @returns {JSX.Element}
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = {
    principal: [
      { label: "Início", href: "/" },
      { label: "Achados e Perdidos", href: "/achados-e-perdidos" },
      { label: "Serviços", href: "/prestadores" },
      { label: "Dicas", href: "/dicas" },
    ],
    institucional: [
      { label: "Como Funciona", href: "/#como-funciona" },
      { label: "Seja Parceiro", href: "/parcerias" },
      { label: "Sou Profissional", href: "/cadastro" },
    ],
    legal: [
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
    ],
    cidades: [
      "Santos", "Guarujá", "Praia Grande", "São Vicente", 
      "Cubatão", "Bertioga", "Mongaguá", "Itanhaém", "Peruíbe"
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo e Descrição */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐾</span>
              <span className="text-2xl font-black text-white">SOS Pet</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Conectando tutores, prestadores de serviços e protetores de animais 
              em toda a Baixada Santista. Juntos, fazemos a diferença na vida dos pets!
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>🗺️</span>
              <span>Baixada Santista, SP</span>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navegação</h3>
            <ul className="space-y-2">
              {navigation.principal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#20B2AA] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              {navigation.institucional.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#20B2AA] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-gray-800 mt-3">
                <Link 
                  href="/prestadores?emergencia24h=true"
                  className="text-[#FF6B35] hover:text-[#e85a2a] transition-colors text-sm font-medium flex items-center gap-1"
                >
                  🚨 Emergência 24h
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal e Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 mb-6">
              {navigation.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-[#20B2AA] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <a 
              href="mailto:contato@sospet.com.br"
              className="text-gray-400 hover:text-[#20B2AA] transition-colors text-sm block mb-2"
            >
              📧 contato@sospet.com.br
            </a>
            <a 
              href="https://wa.me/5513999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors text-sm flex items-center gap-1"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Cidades Atendidas */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <h4 className="text-sm font-bold text-gray-500 mb-3">Cidades Atendidas</h4>
          <div className="flex flex-wrap gap-2">
            {navigation.cidades.map((cidade) => (
              <span 
                key={cidade}
                className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full"
              >
                {cidade}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} SOS Pet. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-xs">Feito com ❤️ para os pets</span>
              
              {/* Redes Sociais */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://instagram.com/sospet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-[#E4405F] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://facebook.com/sospet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-800 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
