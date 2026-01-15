import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | SOS Pet",
  description: "Política de privacidade e proteção de dados da plataforma SOS Pet",
};

export default function PoliticaPrivacidade() {
  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Início</Link>
            <span className="text-gray-700">/</span>
            <span className="text-gray-400">Política de Privacidade</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Política de <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Privacidade</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Última atualização: Janeiro de 2025
            </p>
            <span className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
              <span>✓</span> Em conformidade com a LGPD
            </span>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12">
            
            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">1</span>
                Introdução
              </h2>
              <p className="text-gray-400 leading-relaxed">
                A SOS Pet está comprometida com a proteção da privacidade e dos dados pessoais 
                de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, 
                armazenamos e protegemos suas informações, em conformidade com a Lei Geral de 
                Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">2</span>
                Dados que Coletamos
              </h2>
              
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">📝</span> Dados fornecidos pelo usuário
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Nome completo", "Email", "Telefone/WhatsApp", "Cidade e bairro", "Dados dos pets", "Fotos"].map((item, i) => (
                      <div key={i} className="bg-slate-700/50 rounded-lg px-3 py-2 text-gray-400 text-sm text-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                    <span className="text-purple-400">🤖</span> Dados coletados automaticamente
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Endereço IP", "Tipo de navegador", "Páginas visitadas", "Tempo de permanência", "Localização aprox.", "Cookies"].map((item, i) => (
                      <div key={i} className="bg-slate-700/50 rounded-lg px-3 py-2 text-gray-400 text-sm text-center">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">3</span>
                Como Utilizamos seus Dados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {icon: "🚀", title: "Prestação do serviço", desc: "Permitir o uso da plataforma"},
                  {icon: "📬", title: "Comunicação", desc: "Enviar notificações e alertas sobre pets"},
                  {icon: "📈", title: "Melhoria", desc: "Analisar padrões de uso para aprimorar a plataforma"},
                  {icon: "🛡️", title: "Segurança", desc: "Prevenir fraudes e atividades maliciosas"}
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-white font-bold">{item.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">4</span>
                Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">Você possui os seguintes direitos garantidos pela LGPD:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {icon: "👁️", title: "Acesso", desc: "Saber quais dados temos sobre você"},
                  {icon: "✏️", title: "Correção", desc: "Corrigir dados incompletos ou desatualizados"},
                  {icon: "🗑️", title: "Eliminação", desc: "Solicitar exclusão de dados desnecessários"},
                  {icon: "📦", title: "Portabilidade", desc: "Receber seus dados em formato estruturado"},
                  {icon: "↩️", title: "Revogação", desc: "Retirar seu consentimento a qualquer momento"}
                ].map((item, i) => (
                  <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span>{item.icon}</span>
                      <span className="text-cyan-400 font-bold">{item.title}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Para exercer seus direitos: <span className="text-cyan-400 font-semibold">privacidade@sospet.com.br</span>
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">5</span>
                Compartilhamento
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">Seus dados podem ser compartilhados com:</p>
              <div className="space-y-2 mb-4">
                {[
                  "Prestadores de serviços técnicos (hospedagem, e-mail)",
                  "Outros usuários (informações públicas de anúncios)",
                  "Autoridades (quando exigido por lei)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400">
                    <span className="w-5 h-5 bg-slate-700 rounded flex items-center justify-center text-gray-500 text-xs">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-bold flex items-center gap-2">
                  <span>🚫</span> Não vendemos seus dados pessoais para terceiros.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">6</span>
                Segurança
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {icon: "🔐", text: "Criptografia de dados em trânsito (HTTPS/TLS)"},
                  {icon: "🔑", text: "Controles de acesso baseados em função"},
                  {icon: "🛡️", text: "Row Level Security (RLS) no banco de dados"},
                  {icon: "💾", text: "Backups regulares e monitoramento contínuo"}
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">7</span>
                Cookies
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Utilizamos cookies para manter sua sessão, lembrar preferências e analisar o uso 
                da plataforma (Google Analytics). Você pode gerenciar cookies nas configurações 
                do seu navegador.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-sm text-green-400">8</span>
                Contato
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Dúvidas sobre esta política: <span className="text-green-400 font-semibold">privacidade@sospet.com.br</span>
              </p>
            </section>

            {/* Resumo */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
              <p className="text-green-400 font-bold mb-2 flex items-center gap-2">
                <span>🔒</span> Resumo
              </p>
              <p className="text-gray-400 text-sm">
                Coletamos apenas dados necessários para o funcionamento da plataforma. 
                Você tem controle total sobre seus dados e pode solicitar acesso, correção 
                ou exclusão a qualquer momento. Não vendemos seus dados.
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/termos"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2"
          >
            <span>📋</span> Termos de Uso
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
