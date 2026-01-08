"use client";

import { useState } from 'react';

export default function ShareCard({ pet }) {
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const isPerdido = pet.status === 'perdido';
  const statusColor = isPerdido ? '#dc2626' : '#16a34a';
  const statusText = isPerdido ? '🚨 PERDIDO' : '✅ ENCONTRADO';
  const statusBg = isPerdido ? '#fef2f2' : '#f0fdf4';

  const handleDownload = async () => {
    setGenerating(true);
    setShowCard(true);
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Importar dinamicamente html-to-image
      const { toPng } = await import('html-to-image');
      const element = document.getElementById('pet-share-card');
      
      if (!element) {
        throw new Error('Card não encontrado');
      }

      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
      
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
      const { toPng } = await import('html-to-image');
      const element = document.getElementById('pet-share-card');
      
      if (!element) {
        throw new Error('Card não encontrado');
      }

      const dataUrl = await toPng(element, { quality: 1, pixelRatio: 2 });
      
      // Converter para blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], `alerta-${pet.nome || 'pet'}.png`, { type: 'image/png' });

      // Tentar compartilhar nativamente
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
              <>
                📤 Compartilhar
              </>
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

      {/* Card invisível para geração de imagem */}
      {showCard && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div
            id="pet-share-card"
            style={{
              width: '1080px',
              height: '1080px',
              background: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: statusBg,
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `4px solid ${statusColor}`,
            }}>
              <div style={{
                background: statusColor,
                color: 'white',
                fontSize: '32px',
                fontWeight: '900',
                padding: '12px 32px',
                borderRadius: '50px',
                letterSpacing: '2px',
              }}>
                {statusText}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '40px' }}>🐾</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#FF6B35' }}>
                  SOS Pet
                </span>
              </div>
            </div>

            {/* Imagem */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
            }}>
              {pet.imagem_url ? (
                <img
                  src={pet.imagem_url}
                  alt={pet.nome || 'Pet'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{
                  width: '400px',
                  height: '400px',
                  background: 'white',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '180px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                }}>
                  {pet.especie === 'cao' ? '🐕' : pet.especie === 'gato' ? '🐈' : '🐾'}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{
              background: 'white',
              padding: '32px',
              borderTop: '1px solid #e5e7eb',
            }}>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#1f2937',
                marginBottom: '8px',
              }}>
                {pet.nome || 'Pet sem nome'}
              </div>
              
              <div style={{
                fontSize: '24px',
                color: '#6b7280',
                marginBottom: '24px',
              }}>
                {pet.especie === 'cao' ? 'Cão' : pet.especie === 'gato' ? 'Gato' : pet.especie}
                {pet.raca ? ` • ${pet.raca}` : ''}
                {pet.cor ? ` • ${pet.cor}` : ''}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '28px',
                color: '#374151',
                marginBottom: '16px',
                background: '#f3f4f6',
                padding: '16px 24px',
                borderRadius: '12px',
              }}>
                <span style={{ fontSize: '32px' }}>📍</span>
                <span>
                  <strong>{isPerdido ? 'Visto em:' : 'Encontrado em:'}</strong> {pet.localizacao}
                </span>
              </div>

              <div style={{
                background: '#20B2AA',
                color: 'white',
                padding: '20px 32px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '32px',
                fontWeight: '700',
              }}>
                <span>📞</span>
                <span>CONTATO: {pet.contato_telefone}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              background: '#1f2937',
              color: 'white',
              padding: '16px 32px',
              textAlign: 'center',
              fontSize: '18px',
            }}>
              Ajude a encontrar! Compartilhe este alerta 🙏 | sospet.vercel.app
            </div>
          </div>
        </div>
      )}
    </>
  );
}
