"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const cidades = [
    "Santos", "Guarujá", "Praia Grande", "São Vicente", 
    "Cubatão", "Bertioga", "Mongaguá", "Itanhaém", "Peruíbe"
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Logo */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-3xl">🐾</span>
              <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                SOS Pet
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Conectando tutores, prestadores e protetores em toda a Baixada Santista.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/sospet" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all">
                <span>📷</span>
              </a>
              <a href="https://facebook.com/sospet" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
                <span>📘</span>
              </a>
              <a href="https://wa.me/5513999999999" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all">
                <span>💬</span>
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-bold text-white mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-cyan-400 text-sm">Início</Link></li>
              <li><Link href="/achados-e-perdidos" className="text-gray-400 hover:text-cyan-400 text-sm">Achados e Perdidos</Link></li>
              <li><Link href="/prestadores" className="text-gray-400 hover:text-cyan-400 text-sm">Serviços</Link></li>
              <li><Link href="/dicas" className="text-gray-400 hover:text-cyan-400 text-sm">Dicas</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold text-white mb-4">Institucional</h3>
            <ul className="space-y-3">
              <li><Link href="/parcerias" className="text-gray-400 hover:text-cyan-400 text-sm">Seja Parceiro</Link></li>
              <li><Link href="/cadastro" className="text-gray-400 hover:text-cyan-400 text-sm">Sou Profissional</Link></li>
              <li><Link href="/dashboard-prestador" className="text-gray-400 hover:text-cyan-400 text-sm">Dashboard</Link></li>
              <li><Link href="/prestadores?emergencia24h=true" className="text-orange-400 hover:text-orange-300 text-sm">🚨 Emergência 24h</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/termos" className="text-gray-400 hover:text-cyan-400 text-sm">Termos de Uso</Link></li>
              <li><Link href="/privacidade" className="text-gray-400 hover:text-cyan-400 text-sm">Política de Privacidade</Link></li>
            </ul>
            <h3 className="font-bold text-white mt-6 mb-4">Contato</h3>
            <a href="mailto:contato@sospet.com.br" className="text-gray-400 hover:text-cyan-400 text-sm">
              📧 contato@sospet.com.br
            </a>
          </div>
        </div>

        {/* Cidades */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <h4 className="text-sm font-bold text-gray-500 mb-4">Cidades Atendidas</h4>
          <div className="flex flex-wrap gap-2">
            {cidades.map((cidade) => (
              <span key={cidade} className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full">
                {cidade}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} SOS Pet. Todos os direitos reservados.
            </p>
            <p className="text-gray-600 text-xs">
              Feito com ❤️ para os pets da Baixada Santista
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
