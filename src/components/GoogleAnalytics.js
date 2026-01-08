import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

// Função para rastrear eventos personalizados
export function trackEvent(action, category, label, value) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Eventos pré-definidos para o SOS Pet
export const analytics = {
  // Pets
  petCadastrado: (tipo) => trackEvent('pet_cadastrado', 'pets', tipo),
  petVisualizado: (id) => trackEvent('pet_visualizado', 'pets', id),
  contatoPet: (tipo) => trackEvent('contato_pet', 'pets', tipo), // whatsapp ou telefone
  
  // Prestadores
  prestadorVisualizado: (id) => trackEvent('prestador_visualizado', 'prestadores', id),
  contatoPrestador: (tipo) => trackEvent('contato_prestador', 'prestadores', tipo),
  cadastroPrestador: () => trackEvent('cadastro_prestador', 'prestadores', 'iniciado'),
  
  // Auth
  login: () => trackEvent('login', 'auth', 'sucesso'),
  registro: () => trackEvent('registro', 'auth', 'sucesso'),
  
  // Busca
  busca: (termo) => trackEvent('busca', 'navegacao', termo),
  filtro: (tipo) => trackEvent('filtro_aplicado', 'navegacao', tipo),
};
