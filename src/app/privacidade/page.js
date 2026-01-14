import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | SOS Pet",
  description: "Política de privacidade e proteção de dados da plataforma SOS Pet",
};

export default function PoliticaPrivacidade() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#20B2AA]">Início</Link>
            <span>/</span>
            <span>Política de Privacidade</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-500">
            Última atualização: Janeiro de 2025
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <span>✓</span> Em conformidade com a LGPD (Lei 13.709/2018)
          </div>
        </header>

        {/* Conteúdo */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          
          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">1. Introdução</h2>
            <p className="text-gray-600 leading-relaxed">
              A SOS Pet está comprometida com a proteção da privacidade e dos dados pessoais 
              de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, 
              armazenamos e protegemos suas informações, em conformidade com a Lei Geral de 
              Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">2. Dados que Coletamos</h2>
            
            <h3 className="text-lg font-bold text-gray-700 mb-2">2.1 Dados fornecidos pelo usuário</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Nome completo e e-mail</li>
              <li>Número de telefone/WhatsApp</li>
              <li>Cidade e bairro</li>
              <li>Informações sobre pets (nome, raça, características, fotos)</li>
            </ul>

            <h3 className="text-lg font-bold text-gray-700 mb-2">2.2 Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Endereço IP e tipo de navegador</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>Localização aproximada (se autorizada)</li>
              <li>Cookies e tecnologias similares</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">3. Como Utilizamos seus Dados</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Prestação do serviço:</strong> permitir o uso da plataforma</li>
              <li><strong>Comunicação:</strong> enviar notificações e alertas sobre pets</li>
              <li><strong>Melhoria:</strong> analisar padrões de uso para aprimorar a plataforma</li>
              <li><strong>Segurança:</strong> prevenir fraudes e atividades maliciosas</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">4. Seus Direitos (LGPD)</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Você possui os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Acesso:</strong> saber quais dados temos sobre você</li>
              <li><strong>Correção:</strong> corrigir dados incompletos ou desatualizados</li>
              <li><strong>Eliminação:</strong> solicitar exclusão de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> retirar seu consentimento a qualquer momento</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Para exercer seus direitos: <strong>privacidade@sospet.com.br</strong>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">5. Compartilhamento</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Prestadores de serviços técnicos (hospedagem, e-mail)</li>
              <li>Outros usuários (informações públicas de anúncios)</li>
              <li>Autoridades (quando exigido por lei)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4 font-bold">
              Não vendemos seus dados pessoais para terceiros.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">6. Segurança</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Controles de acesso baseados em função</li>
              <li>Row Level Security (RLS) no banco de dados</li>
              <li>Backups regulares e monitoramento contínuo</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies para manter sua sessão, lembrar preferências e analisar o uso 
              da plataforma (Google Analytics). Você pode gerenciar cookies nas configurações 
              do seu navegador.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">8. Contato</h2>
            <p className="text-gray-600 leading-relaxed">
              Dúvidas sobre esta política: <strong>privacidade@sospet.com.br</strong>
            </p>
          </section>

          {/* Resumo */}
          <div className="mt-12 p-6 bg-[#20B2AA]/10 border-2 border-[#20B2AA]/30 rounded-2xl">
            <p className="text-[#20B2AA] font-bold mb-2">🔒 Resumo</p>
            <p className="text-gray-600 text-sm">
              Coletamos apenas dados necessários para o funcionamento da plataforma. 
              Você tem controle total sobre seus dados e pode solicitar acesso, correção 
              ou exclusão a qualquer momento. Não vendemos seus dados.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/termos"
            className="px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl text-center transition-all"
          >
            📋 Termos de Uso
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-center transition-all"
          >
            ← Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}
