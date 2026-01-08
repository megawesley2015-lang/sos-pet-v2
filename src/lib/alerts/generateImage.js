/**
 * Gerador de Imagem para Partilha - SOS Pet
 * 
 * Gera um card visual com os dados do pet para compartilhar
 * em redes sociais (WhatsApp, Instagram, Facebook)
 * 
 * Tecnologia: html-to-image (100% client-side)
 */

import { toPng } from 'html-to-image';

/**
 * Gera a imagem do card e retorna como Data URL
 */
export async function generateAlertImage(pet) {
  const element = document.getElementById('pet-share-card');
  
  if (!element) {
    throw new Error('Elemento do card não encontrado');
  }

  try {
    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: 2,
    });
    return dataUrl;
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    throw error;
  }
}

/**
 * Faz download da imagem
 */
export async function downloadAlertImage(pet) {
  try {
    const dataUrl = await generateAlertImage(pet);
    
    const link = document.createElement('a');
    link.download = `alerta-${pet.nome || 'pet'}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Compartilhar via Web Share API (mobile)
 */
export async function shareAlertImage(pet) {
  try {
    const dataUrl = await generateAlertImage(pet);
    
    // Converter data URL para Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    const file = new File([blob], `alerta-${pet.nome || 'pet'}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `🚨 Pet ${pet.status === 'perdido' ? 'Perdido' : 'Encontrado'}: ${pet.nome || 'Sem nome'}`,
        text: `Ajude a encontrar! ${pet.especie === 'cao' ? 'Cão' : 'Gato'} ${pet.status} em ${pet.localizacao}. Contato: ${pet.contato_telefone}`,
        files: [file],
      });
      return { success: true, method: 'native' };
    } else {
      // Fallback: download
      await downloadAlertImage(pet);
      return { success: true, method: 'download' };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, cancelled: true };
    }
    console.error('Erro ao compartilhar:', error);
    return { success: false, error: error.message };
  }
}
