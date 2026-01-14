import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | SOS Pet",
  description: "Termos e condições de uso da plataforma SOS Pet",
};

export default function TermosDeUso() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#20B2AA]">Início</Link>
            <span>/</span>
            <span>Termos de Uso</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-500">
            Última atualização: Janeiro de 2025
          </p>
        </header>

        {/* Conteúdo */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm prose prose-lg max-w-none">
          
          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar e utilizar a plataforma SOS Pet ("Plataforma"), você declara que leu, 
              compreendeu e concorda em se vincular a estes Termos de Uso. Caso não concorde 
              com qualquer disposição destes termos, solicitamos que não utilize nossos serviços.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O SOS Pet é uma plataforma digital que atua como <strong>intermediadora</strong> entre:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Tutores de pets em busca de serviços e informações</li>
              <li>Prestadores de serviços pet (veterinários, pet shops, hotéis, etc.)</li>
              <li>ONGs e protetores de animais</li>
              <li>Pessoas que perderam ou encontraram animais</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              <strong>Importante:</strong> O SOS Pet não presta diretamente serviços veterinários, 
              de hospedagem ou qualquer outro serviço pet. Atuamos exclusivamente como plataforma 
              de conexão e divulgação.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">3. Cadastro e Conta</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Para utilizar determinadas funcionalidades da Plataforma, você deverá criar uma conta, 
              fornecendo informações verdadeiras, completas e atualizadas. Você é responsável por:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Manter a confidencialidade de suas credenciais de acesso</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Notificar imediatamente qualquer uso não autorizado</li>
              <li>Manter seus dados cadastrais atualizados</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">4. Uso da Plataforma</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ao utilizar o SOS Pet, você concorda em:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Fornecer informações verdadeiras e precisas</li>
              <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
              <li>Não publicar conteúdo ofensivo, difamatório ou que viole direitos de terceiros</li>
              <li>Não tentar acessar áreas restritas da plataforma</li>
              <li>Não utilizar bots, scripts ou outros meios automatizados sem autorização</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">5. Achados e Perdidos</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A funcionalidade de Achados e Perdidos permite que usuários cadastrem informações 
              sobre pets perdidos ou encontrados. O SOS Pet:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Não garante o reencontro de animais</li>
              <li>Não verifica a veracidade das informações cadastradas</li>
              <li>Não se responsabiliza por acordos entre usuários</li>
              <li>Reserva-se o direito de remover anúncios que violem estes termos</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">6. Prestadores de Serviços</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Os prestadores de serviços cadastrados na plataforma são profissionais ou empresas 
              independentes. O SOS Pet:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Não é empregador dos prestadores</li>
              <li>Não garante a qualidade dos serviços prestados por terceiros</li>
              <li>Não se responsabiliza por transações realizadas fora da plataforma</li>
              <li>Realiza verificação básica, mas não pode garantir a idoneidade de todos os cadastros</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Recomendamos que os usuários verifiquem referências e solicitem informações 
              adicionais antes de contratar qualquer serviço.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">7. Conteúdo Informativo</h2>
            <p className="text-gray-600 leading-relaxed">
              As dicas e informações sobre cuidados com pets disponibilizadas na plataforma têm 
              caráter <strong>exclusivamente informativo e educativo</strong>. Este conteúdo não 
              substitui, em hipótese alguma, a consulta e orientação de um médico veterinário. 
              Em caso de emergência ou dúvidas sobre a saúde do seu pet, procure um profissional 
              qualificado.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">8. Propriedade Intelectual</h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo da plataforma SOS Pet, incluindo textos, imagens, logotipos, ícones, 
              código-fonte e design, é protegido por direitos autorais e outras leis de propriedade 
              intelectual. É proibida a reprodução, distribuição ou modificação sem autorização prévia.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O SOS Pet não será responsável por:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso da plataforma</li>
              <li>Ações ou omissões de prestadores de serviços cadastrados</li>
              <li>Perda de dados ou interrupções no serviço</li>
              <li>Conteúdo publicado por terceiros na plataforma</li>
              <li>Transações realizadas entre usuários</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">10. Modificações</h2>
            <p className="text-gray-600 leading-relaxed">
              O SOS Pet reserva-se o direito de modificar estes Termos de Uso a qualquer momento. 
              As alterações entrarão em vigor imediatamente após sua publicação na plataforma. 
              O uso continuado dos serviços após tais modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">11. Lei Aplicável</h2>
            <p className="text-gray-600 leading-relaxed">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Fica eleito o foro da comarca de Santos/SP para dirimir quaisquer controvérsias 
              decorrentes destes termos.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-4">12. Contato</h2>
            <p className="text-gray-600 leading-relaxed">
              Para dúvidas, sugestões ou reclamações relacionadas a estes Termos de Uso, 
              entre em contato através do email: <strong>contato@sospet.com.br</strong>
            </p>
          </section>

          {/* Aviso */}
          <div className="mt-12 p-6 bg-[#20B2AA]/10 border-2 border-[#20B2AA]/30 rounded-2xl">
            <p className="text-[#20B2AA] font-bold mb-2">📋 Resumo</p>
            <p className="text-gray-600 text-sm">
              O SOS Pet é uma plataforma de conexão. Não prestamos serviços veterinários 
              diretamente. As informações são educativas e não substituem profissionais. 
              Você é responsável por verificar a qualidade dos prestadores antes de contratar.
            </p>
          </div>
        </div>

        {/* Links relacionados */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/privacidade"
            className="px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl text-center transition-all"
          >
            🔒 Política de Privacidade
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
