import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | SOS Pet",
  description: "Termos e condições de uso da plataforma SOS Pet",
};

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Início</Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">Termos de Uso</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Termos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Uso</span>
            </h1>
          </div>
          
          <p className="text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Última atualização: Janeiro de 2025
          </p>
        </header>

        {/* Conteúdo */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12">
            
            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">1</span>
                Aceitação dos Termos
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Ao acessar e utilizar a plataforma SOS Pet ("Plataforma"), você declara que leu, 
                compreendeu e concorda em se vincular a estes Termos de Uso. Caso não concorde 
                com qualquer disposição destes termos, solicitamos que não utilize nossos serviços.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">2</span>
                Descrição do Serviço
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                O SOS Pet é uma plataforma digital que atua como <span className="text-cyan-400 font-semibold">intermediadora</span> entre:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <span className="text-gray-300 text-sm">Tutores de pets em busca de serviços</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">🏥</span>
                  <span className="text-gray-300 text-sm">Prestadores de serviços pet</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">💚</span>
                  <span className="text-gray-300 text-sm">ONGs e protetores de animais</span>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">🔍</span>
                  <span className="text-gray-300 text-sm">Pessoas que perderam ou encontraram animais</span>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-400 text-sm">
                  <span className="font-bold">Importante:</span> O SOS Pet não presta diretamente serviços veterinários, 
                  de hospedagem ou qualquer outro serviço pet. Atuamos exclusivamente como plataforma 
                  de conexão e divulgação.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">3</span>
                Cadastro e Conta
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Para utilizar determinadas funcionalidades da Plataforma, você deverá criar uma conta, 
                fornecendo informações verdadeiras, completas e atualizadas. Você é responsável por:
              </p>
              <div className="space-y-2">
                {["Manter a confidencialidade de suas credenciais de acesso", 
                  "Todas as atividades realizadas em sua conta",
                  "Notificar imediatamente qualquer uso não autorizado",
                  "Manter seus dados cadastrais atualizados"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400">
                    <span className="w-5 h-5 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-400 text-xs">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">4</span>
                Uso da Plataforma
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">Ao utilizar o SOS Pet, você concorda em:</p>
              <div className="space-y-2">
                {["Fornecer informações verdadeiras e precisas",
                  "Não utilizar a plataforma para fins ilegais ou não autorizados",
                  "Não publicar conteúdo ofensivo, difamatório ou que viole direitos de terceiros",
                  "Não tentar acessar áreas restritas da plataforma",
                  "Não utilizar bots, scripts ou outros meios automatizados sem autorização"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400">
                    <span className="w-5 h-5 bg-green-500/20 rounded flex items-center justify-center text-green-400 text-xs">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">5</span>
                Achados e Perdidos
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                A funcionalidade de Achados e Perdidos permite que usuários cadastrem informações 
                sobre pets perdidos ou encontrados. O SOS Pet:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[{icon: "❌", text: "Não garante o reencontro de animais"},
                  {icon: "❌", text: "Não verifica a veracidade das informações cadastradas"},
                  {icon: "❌", text: "Não se responsabiliza por acordos entre usuários"},
                  {icon: "✓", text: "Reserva-se o direito de remover anúncios que violem estes termos"}].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">6</span>
                Prestadores de Serviços
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Os prestadores de serviços cadastrados na plataforma são profissionais ou empresas 
                independentes. O SOS Pet não é empregador dos prestadores e não garante a qualidade 
                dos serviços prestados por terceiros.
              </p>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-400 text-sm">
                  <span className="font-bold">💡 Recomendação:</span> Verifique referências e solicite informações 
                  adicionais antes de contratar qualquer serviço.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">7</span>
                Conteúdo Informativo
              </h2>
              <p className="text-gray-400 leading-relaxed">
                As dicas e informações sobre cuidados com pets disponibilizadas na plataforma têm 
                caráter <span className="text-cyan-400 font-semibold">exclusivamente informativo e educativo</span>. Este conteúdo não 
                substitui, em hipótese alguma, a consulta e orientação de um médico veterinário. 
                Em caso de emergência ou dúvidas sobre a saúde do seu pet, procure um profissional 
                qualificado.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-sm text-cyan-400">8</span>
                Contato
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Para dúvidas, sugestões ou reclamações relacionadas a estes Termos de Uso, 
                entre em contato através do email: <span className="text-cyan-400 font-semibold">contato@sospet.com.br</span>
              </p>
            </section>

            {/* Resumo */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
              <p className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <span>📋</span> Resumo
              </p>
              <p className="text-gray-400 text-sm">
                O SOS Pet é uma plataforma de conexão. Não prestamos serviços veterinários 
                diretamente. As informações são educativas e não substituem profissionais. 
                Você é responsável por verificar a qualidade dos prestadores antes de contratar.
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/privacidade"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
          >
            <span>🔒</span> Política de Privacidade
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300 font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
          >
            <span>←</span> Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}
