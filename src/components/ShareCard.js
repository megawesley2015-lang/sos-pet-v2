"use client";

import { useState } from 'react';

export default function ShareCard({ pet }) {
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const isPerdido = pet.status === 'perdido';
  const isEncontrado = pet.status === 'encontrado';
  
  const headerColor = isPerdido ? '#FF6B35' : isEncontrado ? '#16a34a' : '#3b82f6';
  const accentColor = '#20B2AA';
  const statusText = isPerdido ? 'PET PERDIDO!' : isEncontrado ? 'PET ENCONTRADO!' : 'PARA ADOÇÃO!';
  const ctaText = isPerdido ? 'AJUDE-O A VOLTAR PARA CASA! 🙏' : isEncontrado ? 'VOCÊ CONHECE ESSE PET? 🙏' : 'DÊ UM LAR A ESSE AMIGO! 💙';

  // Função para gerar a imagem
  const generateImage = async () => {
    const { toPng } = await import('html-to-image');
    const element = document.getElementById('pet-share-card');
    
    if (!element) throw new Error('Card não encontrado');

    return await toPng(element, { quality: 1, pixelRatio: 2 });
  };

  const handleDownload = async () => {
    setGenerating(true);
    setShowCard(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const dataUrl = await generateImage();
      
      const link = document.createElement('a');
      link.download = `alerta-${pet.nome || 'pet'}-${Date.now()}.png`;
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
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const dataUrl = await generateImage();
      
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `alerta-${pet.nome || 'pet'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `🚨 Pet ${pet.status === 'perdido' ? 'Perdido' : 'Encontrado'}`,
          text: `Ajude a encontrar! ${pet.nome || 'Pet'} - ${pet.localizacao}`,
          files: [file],
        });
      } else {
        // Fallback: download
        const link = document.createElement('a');
        link.download = `alerta-${pet.nome || 'pet'}.png`;
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
            className="flex-1 bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
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
            className="flex-1 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-bold transition-all border-2 border-gray-200 flex items-center justify-center gap-2"
          >
            💾 Baixar Imagem
          </button>
        </div>
      </div>

      {/* Card para geração - Design Profissional */}
      {showCard && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            id="pet-share-card"
            style={{
              width: '1080px',
              height: '1350px',
              background: '#f0f0f0',
              fontFamily: 'Arial, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            {/* Card interno com sombra */}
            <div style={{
              width: '1000px',
              height: '1270px',
              background: '#ffffff',
              borderRadius: '40px',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              
              {/* Patinhas decorativas no fundo do card */}
              <div style={{
                position: 'absolute',
                top: '200px',
                left: '40px',
                fontSize: '55px',
                opacity: 0.07,
                transform: 'rotate(-20deg)',
              }}>🐾</div>
              <div style={{
                position: 'absolute',
                top: '400px',
                right: '40px',
                fontSize: '50px',
                opacity: 0.07,
                transform: 'rotate(15deg)',
              }}>🐾</div>
              <div style={{
                position: 'absolute',
                bottom: '300px',
                left: '50px',
                fontSize: '45px',
                opacity: 0.07,
                transform: 'rotate(-10deg)',
              }}>🐾</div>
              <div style={{
                position: 'absolute',
                bottom: '400px',
                right: '50px',
                fontSize: '48px',
                opacity: 0.07,
                transform: 'rotate(20deg)',
              }}>🐾</div>

              {/* Header com patinhas BRANCAS */}
              <div style={{
                background: headerColor,
                padding: '35px 40px',
                textAlign: 'center',
                borderRadius: '0 0 30px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              }}>
                {/* Patinha esquerda - BRANCA */}
                <span style={{ 
                  fontSize: '45px',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9,
                }}>🐾</span>
                
                <div style={{
                  color: 'white',
                  fontSize: '52px',
                  fontWeight: '900',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}>
                  {statusText}
                </div>
                
                {/* Patinha direita - BRANCA */}
                <span style={{ 
                  fontSize: '45px',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9,
                }}>🐾</span>
              </div>

              {/* Container da foto com 4 patinhas ao redor */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '40px',
                marginBottom: '30px',
                position: 'relative',
              }}>
                {/* 4 Patinhas CINZA ao redor da foto */}
                {/* Patinha superior esquerda */}
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '250px',
                  fontSize: '50px',
                  opacity: 0.15,
                  transform: 'rotate(-30deg)',
                }}>🐾</span>
                
                {/* Patinha superior direita */}
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '250px',
                  fontSize: '50px',
                  opacity: 0.15,
                  transform: 'rotate(30deg)',
                }}>🐾</span>
                
                {/* Patinha inferior esquerda */}
                <span style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '250px',
                  fontSize: '50px',
                  opacity: 0.15,
                  transform: 'rotate(-15deg)',
                }}>🐾</span>
                
                {/* Patinha inferior direita */}
                <span style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '250px',
                  fontSize: '50px',
                  opacity: 0.15,
                  transform: 'rotate(15deg)',
                }}>🐾</span>

                {/* Foto circular */}
                <div style={{
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  border: `8px solid ${accentColor}`,
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                  background: '#f0f0f0',
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
                    <span style={{ fontSize: '150px' }}>
                      {pet.especie === 'cao' ? '🐕' : pet.especie === 'gato' ? '🐈' : '🐾'}
                    </span>
                  )}
                </div>
              </div>

              {/* Nome do Pet */}
              <div style={{
                textAlign: 'center',
                marginBottom: '10px',
              }}>
                <div style={{
                  fontSize: '64px',
                  fontWeight: '900',
                  color: '#1f2937',
                }}>
                  {pet.nome || 'Pet sem nome'}
                </div>
                {pet.comportamento && (
                  <div style={{
                    fontSize: '28px',
                    color: '#6b7280',
                    marginTop: '5px',
                  }}>
                    ({pet.comportamento})
                  </div>
                )}
              </div>

              {/* Informações do Pet */}
              <div style={{
                textAlign: 'center',
                fontSize: '30px',
                color: '#374151',
                lineHeight: '1.8',
                marginBottom: '25px',
              }}>
                <div><strong>Espécie:</strong> {pet.especie === 'cao' ? 'Cachorro' : pet.especie === 'gato' ? 'Gato' : pet.especie}</div>
                {pet.idade_aproximada && <div><strong>Idade:</strong> {pet.idade_aproximada}</div>}
                {pet.raca && <div><strong>Raça:</strong> {pet.raca}{pet.cor ? `, ${pet.cor}` : ''}</div>}
                {pet.porte && <div><strong>Porte:</strong> {pet.porte}</div>}
              </div>

              {/* Faixa de Localização */}
              <div style={{
                background: accentColor,
                padding: '25px 40px',
                textAlign: 'center',
                margin: '0 40px',
                borderRadius: '20px',
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '26px',
                  marginBottom: '8px',
                }}>
                  📍 {isPerdido ? 'Visto pela última vez em:' : 'Encontrado em:'}
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '36px',
                  fontWeight: '700',
                }}>
                  {pet.localizacao}
                </div>
              </div>

              {/* Contatos */}
              <div style={{
                padding: '30px 60px',
                textAlign: 'center',
              }}>
                {/* Telefone */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  fontSize: '36px',
                  color: '#374151',
                  marginBottom: '15px',
                }}>
                  <span style={{ color: '#dc2626', fontSize: '40px' }}>📞</span>
                  <span><strong>LIGAR:</strong> {formatPhone(pet.contato_telefone)}</span>
                </div>
                
                {/* WhatsApp */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  fontSize: '36px',
                  color: '#25D366',
                }}>
                  <span style={{ fontSize: '40px' }}>💬</span>
                  <span><strong>WHATSAPP:</strong> {formatPhone(pet.contato_telefone)}</span>
                </div>
              </div>

              {/* CTA Final */}
              <div style={{
                textAlign: 'center',
                padding: '20px',
                marginTop: 'auto',
              }}>
                <div style={{
                  fontSize: '38px',
                  fontWeight: '900',
                  color: '#1f2937',
                  letterSpacing: '1px',
                }}>
                  {ctaText}
                </div>
              </div>

              {/* Footer com Logo */}
              <div style={{
                background: '#1f2937',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
              }}>
                <span style={{ fontSize: '35px' }}>🐾</span>
                <span style={{
                  color: '#FF6B35',
                  fontSize: '32px',
                  fontWeight: '900',
                }}>SOS Pet</span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '24px',
                }}>| sospet.vercel.app</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
