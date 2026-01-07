import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-black text-[#FF6B35]">SOS Pet</span>
            </div>
            <p className="text-gray-400 text-sm">
              Conectando tutores aos melhores serviços para pets.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-[#20B2AA]">Início</Link></li>
              <li><Link href="/prestadores" className="hover:text-[#20B2AA]">Prestadores</Link></li>
              <li><Link href="/achados-e-perdidos" className="hover:text-[#20B2AA]">Achados e Perdidos</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-bold mb-4">Categorias</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/prestadores?category=Veterinario" className="hover:text-[#20B2AA]">Veterinários</Link></li>
              <li><Link href="/prestadores?category=Pet Shop" className="hover:text-[#20B2AA]">Pet Shops</Link></li>
              <li><Link href="/prestadores?category=Hotel" className="hover:text-[#20B2AA]">Hotéis Pet</Link></li>
              <li><Link href="/prestadores?category=Banho e Tosa" className="hover:text-[#20B2AA]">Banho e Tosa</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>contato@sospet.com.br</li>
              <li>Guarujá, SP</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 SOS Pet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
