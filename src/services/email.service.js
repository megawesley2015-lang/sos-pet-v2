// Serviço de Email usando Resend
// Para usar: npm install resend

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'SOS Pet <noreply@sospet.com.br>';

/**
 * Enviar email genérico
 */
export async function sendEmail({ to, subject, html, text }) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY não configurada. Email não enviado.');
    return { success: false, error: 'API key não configurada' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Templates de Email
 */
export const emailTemplates = {
  // Email de boas-vindas
  welcome: (nome) => ({
    subject: 'Bem-vindo ao SOS Pet! 🐾',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #20B2AA, #1a9e97); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 SOS Pet</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Seja bem-vindo(a) ao SOS Pet! Estamos muito felizes em ter você conosco.</p>
            <p>Com o SOS Pet, você pode:</p>
            <ul>
              <li>🔍 Encontrar prestadores de serviços pet na sua região</li>
              <li>📢 Cadastrar pets perdidos ou encontrados</li>
              <li>💬 Entrar em contato direto com tutores e prestadores</li>
            </ul>
            <p>Comece agora mesmo a explorar!</p>
            <a href="https://sospet.vercel.app" class="button">Acessar o SOS Pet</a>
          </div>
          <div class="footer">
            <p>© 2026 SOS Pet. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Olá, ${nome}! Bem-vindo ao SOS Pet! Acesse: https://sospet.vercel.app`,
  }),

  // Notificação de pet cadastrado
  petCadastrado: (nome, petNome, status) => ({
    subject: `Pet ${status === 'perdido' ? 'perdido' : 'encontrado'} cadastrado com sucesso! 🐾`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${status === 'perdido' ? '#dc2626' : '#16a34a'}; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${status === 'perdido' ? '🔴 Pet Perdido' : '🟢 Pet Encontrado'}</h1>
          </div>
          <div class="content">
            <h2>Olá, ${nome}!</h2>
            <p>Seu registro de <strong>${petNome || 'pet'}</strong> foi cadastrado com sucesso.</p>
            <p>${status === 'perdido' 
              ? 'Não desanime! Milhares de pets são reencontrados todos os dias. Compartilhe o registro nas redes sociais para aumentar as chances de encontrá-lo.' 
              : 'Obrigado por ajudar! Seu registro está disponível para que o tutor possa encontrar seu pet.'
            }</p>
            <a href="https://sospet.vercel.app/meus-pets" class="button">Ver Meus Registros</a>
          </div>
          <div class="footer">
            <p>© 2026 SOS Pet. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Olá, ${nome}! Seu pet ${petNome || ''} foi cadastrado com sucesso no SOS Pet.`,
  }),

  // Cadastro de prestador recebido
  cadastroPrestadorRecebido: (nome, nomeNegocio) => ({
    subject: 'Recebemos seu cadastro! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #20B2AA, #1a9e97); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .steps { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .step { display: flex; align-items: center; margin: 10px 0; }
          .step-number { background: #20B2AA; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🐾 SOS Pet</h1>
          </div>
          <div class="content">
            <h2>Olá!</h2>
            <p>Recebemos o cadastro de <strong>${nomeNegocio}</strong> com sucesso!</p>
            
            <div class="steps">
              <h3>Próximos passos:</h3>
              <div class="step">
                <span class="step-number">1</span>
                <span>Nossa equipe vai analisar os dados enviados</span>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <span>Entraremos em contato para validação</span>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <span>Seu perfil será ativado na plataforma</span>
              </div>
            </div>

            <p>O prazo médio para aprovação é de <strong>até 48 horas úteis</strong>.</p>
            <p>Obrigado por fazer parte do SOS Pet!</p>
          </div>
          <div class="footer">
            <p>© 2026 SOS Pet. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Recebemos o cadastro de ${nomeNegocio}! Nossa equipe entrará em contato em até 48 horas.`,
  }),
};

/**
 * Funções de envio específicas
 */
export async function enviarEmailBoasVindas(email, nome) {
  const template = emailTemplates.welcome(nome);
  return sendEmail({ to: email, ...template });
}

export async function enviarEmailPetCadastrado(email, nome, petNome, status) {
  const template = emailTemplates.petCadastrado(nome, petNome, status);
  return sendEmail({ to: email, ...template });
}

export async function enviarEmailCadastroPrestador(email, nome, nomeNegocio) {
  const template = emailTemplates.cadastroPrestadorRecebido(nome, nomeNegocio);
  return sendEmail({ to: email, ...template });
}
