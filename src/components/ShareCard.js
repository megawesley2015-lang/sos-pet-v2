"use client";

import { useState } from 'react';

export default function ShareCard({ pet }) {
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const isPerdido = pet.status === 'perdido';
  const isEncontrado = pet.status === 'encontrado';
  
  const headerColor = isPerdido ? '#FF851B' : isEncontrado ? '#16a34a' : '#3b82f6';
  const accentColor = '#20B2AA';
  const statusText = isPerdido ? 'PET PERDIDO!' : isEncontrado ? 'PET ENCONTRADO!' : 'ADOÇÃO!';
  const ctaText = isPerdido ? 'AJUDE-O A VOLTAR PARA CASA! 🙏' : isEncontrado ? 'VOCÊ CONHECE ESSE PET? 🙏' : 'DÊ UM LAR A ESSE AMIGO! 💙';

  // Função unificada para gerar imagem
  const generateImage = async () => {
    const { toPng } = await import('html-to-image');
    const element = document.getElementById('pet-share-card');
    
    if (!element) throw new Error('Card não encontrado');

    return await toPng(element, { quality: 1, pixelRatio: 2 });
  };

  const handleDownload = async () => {
    setGenerating(true);
    setShowCard(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const dataUrl = await generateImage();
      
      const link = document.createElement('a');
      link.download = `sos-pet-${pet.nome || 'alerta'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setGenerating(false);
      setShowCard(false);
    }
  };

  const handleShare = async () => {
    setGenerating(true);
    setShowCard(true);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    try {
      const dataUrl = await generateImage();
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `sos-pet-${pet.nome || 'alerta'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `🚨 Pet ${pet.status === 'perdido' ? 'Perdido' : 'Encontrado'}`,
          text: `Ajude a encontrar! ${pet.nome || 'Pet'} - ${pet.localizacao}`,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.download = `sos-pet-${pet.nome || 'alerta'}.png`;
        link.href = dataUrl;
        link.click();
        alert('Imagem salva! Agora você pode compartilhar nas redes sociais.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Erro:', error);
      }
    } finally {
      setGenerating(false);
      setShowCard(false);
    }
  };

  // Formatar telefone
  const formatPhone = (phone) => {
    const cleaned = phone?.replace(/\D/g, '') || '';
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,2)}) ${cleaned.slice(2,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // SVG da patinha branca
  const PawPrint = ({ size = 24, color = 'white', opacity = 1, style = {} }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={color}
      style={{ opacity, ...style }}
    >
      <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 8.5c-1 1-1 2.5 0 3.5l3 3c.5.5 1.5.5 2 0l3-3c1-1 1-2.5 0-3.5-1-1-2.5-1-3.5 0l-.5.5-.5-.5c-1-1-2.5-1-3.5 0z"/>
    </svg>
  );

  return (
    <>
      {/* Botões de ação */}
      <div className="bg-gradient-to-r from-[#FF6B35]/10 to-[#20B2AA]/10 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          📸 Gerar Arte para Partilha
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Crie uma imagem profissional para compartilhar no WhatsApp, Instagram e Facebook
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            disabled={generating}
            className="flex-1 bg-[#FF6B35] hover:bg-[#e85a2a] hover:-translate-y-1 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {generating ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Gerando...
              </>
            ) : (
              <>📤 Compartilhar</>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex-1 bg-white hover:bg-gray-50 hover:-translate-y-1 disabled:bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold transition-all duration-300 border-2 border-gray-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {generating ? (
              <>
                <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                Gerando...
              </>
            ) : (
              <>💾 Baixar Imagem</>
            )}
          </button>
        </div>
      </div>

      {/* ====== CARD PARA GERAÇÃO DE IMAGEM ====== */}
      {showCard && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            id="pet-share-card"
            style={{
              width: '1080px',
              height: '1350px',
              background: '#e8e8e8',
              fontFamily: 'Arial, Helvetica, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            {/* Card interno */}
            <div style={{
              width: '1000px',
              height: '1270px',
              background: '#ffffff',
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: '0 30px 100px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              
              {/* ===== PATINHAS DE FUNDO (Marca d'água) ===== */}
              {/* Patinha superior esquerda */}
              <div style={{
                position: 'absolute',
                top: '180px',
                left: '60px',
                fontSize: '80px',
                color: 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-25deg)',
              }}>🐾</div>
              
              {/* Patinha superior direita */}
              <div style={{
                position: 'absolute',
                top: '220px',
                right: '50px',
                fontSize: '70px',
                color: 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(20deg)',
              }}>🐾</div>
              
              {/* Patinha inferior esquerda */}
              <div style={{
                position: 'absolute',
                bottom: '320px',
                left: '70px',
                fontSize: '65px',
                color: 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-15deg)',
              }}>🐾</div>
              
              {/* Patinha inferior direita */}
              <div style={{
                position: 'absolute',
                bottom: '280px',
                right: '60px',
                fontSize: '75px',
                color: 'rgba(0, 0, 0, 0.05)',
                transform: 'rotate(30deg)',
              }}>🐾</div>

              {/* ===== HEADER LARANJA ===== */}
              <div style={{
                background: headerColor,
                padding: '28px 40px',
                textAlign: 'center',
                borderRadius: '0 0 32px 32px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              }}>
                {/* Patinha BRANCA esquerda */}
                <span style={{ 
                  fontSize: '40px',
                  filter: 'brightness(0) invert(1)',
                }}>🐾</span>
                
                {/* Texto com patinha sobreposta */}
                <div style={{ position: 'relative' }}>
                  <span style={{
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: '900',
                    letterSpacing: '4px',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    {statusText}
                  </span>
                  
                  {/* Patinha pequena branca atrás do texto (overlay) */}
                  <span style={{
                    position: 'absolute',
                    bottom: '-5px',
                    right: '45%',
                    fontSize: '22px',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.4,
                  }}>🐾</span>
                </div>
                
                {/* Patinha BRANCA direita */}
                <span style={{ 
                  fontSize: '40px',
                  filter: 'brightness(0) invert(1)',
                }}>🐾</span>
              </div>

              {/* ===== ÁREA DA FOTO ===== */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '50px',
                marginBottom: '30px',
                position: 'relative',
              }}>
                {/* 4 Patinhas CINZA ao redor da foto */}
                <span style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '220px',
                  fontSize: '55px',
                  color: 'rgba(0, 0, 0, 0.08)',
                  transform: 'rotate(-35deg)',
                }}>🐾</span>
                
                <span style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '220px',
                  fontSize: '55px',
                  color: 'rgba(0, 0, 0, 0.08)',
                  transform: 'rotate(35deg)',
                }}>🐾</span>
                
                <span style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '220px',
                  fontSize: '55px',
                  color: 'rgba(0, 0, 0, 0.08)',
                  transform: 'rotate(-20deg)',
                }}>🐾</span>
                
                <span style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '220px',
                  fontSize: '55px',
                  color: 'rgba(0, 0, 0, 0.08)',
                  transform: 'rotate(20deg)',
                }}>🐾</span>

                {/* Foto circular com borda verde água */}
                <div style={{
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  border: `10px solid ${accentColor}`,
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(32, 178, 170, 0.3)',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {pet.imagem_url ? (
                    <img
                      src={pet.imagem_url}
                      alt={pet.nome || 'Pet'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <span style={{ fontSize: '160px' }}>
                      {pet.especie === 'cao' ? '🐕' : pet.especie === 'gato' ? '🐈' : '🐾'}
                    </span>
                  )}
                </div>
              </div>

              {/* ===== NOME DO PET com patinhas laterais ===== */}
              <div style={{
                textAlign: 'center',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              }}>
                {/* Patinha esquerda do nome */}
                <span style={{ 
                  fontSize: '35px',
                  color: 'rgba(0, 0, 0, 0.15)',
                }}>🐾</span>
                
                <div style={{
                  fontSize: '72px',
                  fontWeight: '900',
                  color: '#1f2937',
                }}>
                  {pet.nome || 'Pet sem nome'}
                </div>
                
                {/* Patinha direita do nome */}
                <span style={{ 
                  fontSize: '35px',
                  color: 'rgba(0, 0, 0, 0.15)',
                }}>🐾</span>
              </div>

              {/* Comportamento */}
              {pet.comportamento && (
                <div style={{
                  textAlign: 'center',
                  fontSize: '28px',
                  color: '#6b7280',
                  marginBottom: '15px',
                }}>
                  ({pet.comportamento})
                </div>
              )}

              {/* ===== INFORMAÇÕES DO PET ===== */}
              <div style={{
                textAlign: 'center',
                fontSize: '32px',
                color: '#374151',
                lineHeight: '2',
                marginBottom: '30px',
              }}>
                <div><strong>Espécie:</strong> {pet.especie === 'cao' ? 'Cachorro' : pet.especie === 'gato' ? 'Gato' : pet.especie}</div>
                {pet.idade_aproximada && <div><strong>Idade:</strong> {pet.idade_aproximada}</div>}
                {pet.raca && <div><strong>Raça:</strong> {pet.raca}{pet.cor ? `, ${pet.cor}` : ''}</div>}
                {pet.porte && <div><strong>Porte:</strong> {pet.porte}</div>}
              </div>

              {/* ===== FAIXA DE LOCALIZAÇÃO VERDE ÁGUA ===== */}
              <div style={{
                background: accentColor,
                padding: '28px 50px',
                textAlign: 'center',
                margin: '0 50px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(32, 178, 170, 0.3)',
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '26px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}>
                  <span>📍</span>
                  <span>{isPerdido ? 'Visto pela última vez em:' : 'Encontrado em:'}</span>
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '40px',
                  fontWeight: '800',
                }}>
                  {pet.localizacao}
                </div>
              </div>

              {/* ===== CONTATOS ===== */}
              <div style={{
                padding: '35px 60px',
                textAlign: 'center',
              }}>
                {/* Telefone */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  fontSize: '38px',
                  color: '#374151',
                  marginBottom: '18px',
                }}>
                  <span style={{ 
                    fontSize: '45px',
                    color: '#dc2626',
                  }}>📞</span>
                  <span><strong>LIGAR:</strong> {formatPhone(pet.contato_telefone)}</span>
                </div>
                
                {/* WhatsApp */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  fontSize: '38px',
                  color: '#25D366',
                }}>
                  <span style={{ fontSize: '45px' }}>💬</span>
                  <span><strong>WHATSAPP:</strong> {formatPhone(pet.contato_telefone)}</span>
                </div>
              </div>

              {/* ===== CTA FINAL ===== */}
              <div style={{
                textAlign: 'center',
                padding: '15px 40px',
                marginTop: 'auto',
              }}>
                <div style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  color: '#1f2937',
                  letterSpacing: '1px',
                }}>
                  {ctaText}
                </div>
              </div>

              {/* ===== FOOTER COM LOGO ===== */}
              <div style={{
                background: '#1f2937',
                padding: '22px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
              }}>
                <span style={{ fontSize: '38px' }}>🐾</span>
                <span style={{
                  color: '#FF6B35',
                  fontSize: '36px',
                  fontWeight: '900',
                }}>SOS Pet</span>
                <span style={{
                  color: '#6b7280',
                  fontSize: '26px',
                }}>| sospet.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
