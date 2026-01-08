/**
 * Sistema de Alertas - SOS Pet
 * 
 * Estrutura fatiada para crescimento sustentável:
 * 
 * ✅ MVP (Agora):
 *    - generateImage.js → Gerar arte para partilha manual
 * 
 * 🔜 Pós-MVP:
 *    - notifyUsers.js → Notificações internas na plataforma
 * 
 * 🔮 Futuro:
 *    - socialPublish.js → Automação de redes sociais (Meta API)
 */

// MVP - Geração de imagem para partilha
export { 
  generateAlertImage, 
  downloadAlertImage, 
  shareAlertImage 
} from './generateImage';

// Pós-MVP - Notificações internas (placeholder)
export { 
  notifyUsersInRegion, 
  getUserNotifications, 
  markNotificationAsRead 
} from './notifyUsers';

// Futuro - Publicação automática (placeholder)
export { 
  publishToFacebook, 
  publishToInstagram, 
  publishToTwitter 
} from './socialPublish';
