import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Ilustração */}
        <div className="relative mb-8">
          <span className="text-[150px] leading-none">🐕</span>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center animate-bounce">
            ?
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-6xl font-black text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Opa! Página não encontrada
        </h2>
        <p className="text-gray-500 mb-8">
          Parece que essa página fugiu igual um cachorrinho sapeca! 
          Mas não se preocupe, vamos te ajudar a voltar.
        </p>

        {/* Patinhas decorativas */}
        <div className="flex justify-center gap-2 mb-8 opacity-20">
          <span className="text-3xl rotate-[-20deg]">🐾</span>
          <span className="text-3xl rotate-[10deg]">🐾</span>
          <span className="text-3xl rotate-[-15deg]">🐾</span>
          <span className="text-3xl rotate-[25deg]">🐾</span>
        </div>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            🏠 Voltar ao Início
          </Link>
          <Link
            href="/achados-e-perdidos"
            className="bg-[#FF6B35] hover:bg-[#e85a2a] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            🐾 Ver Pets
          </Link>
        </div>

        {/* Links úteis */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">Talvez você esteja procurando:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/prestadores" className="text-[#20B2AA] hover:underline">
              Prestadores
            </Link>
            <Link href="/achados-e-perdidos" className="text-[#20B2AA] hover:underline">
              Achados e Perdidos
            </Link>
            <Link href="/cadastro" className="text-[#20B2AA] hover:underline">
              Cadastrar Serviço
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
