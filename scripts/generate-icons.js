# Script para gerar ícones PWA
# Execute: node scripts/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Criar diretório se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// SVG inline caso o arquivo não exista
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#20B2AA"/>
  <ellipse cx="256" cy="300" rx="80" ry="70" fill="white"/>
  <ellipse cx="170" cy="210" rx="40" ry="50" fill="white" transform="rotate(-20 170 210)"/>
  <ellipse cx="230" cy="170" rx="35" ry="45" fill="white" transform="rotate(-5 230 170)"/>
  <ellipse cx="290" cy="170" rx="35" ry="45" fill="white" transform="rotate(5 290 170)"/>
  <ellipse cx="345" cy="210" rx="40" ry="50" fill="white" transform="rotate(20 345 210)"/>
  <text x="256" y="440" font-family="Arial, sans-serif" font-size="80" font-weight="900" fill="white" text-anchor="middle">SOS</text>
</svg>`;

async function generateIcons() {
  console.log('🎨 Gerando ícones PWA...\n');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Erro ao gerar icon-${size}x${size}.png:`, error.message);
    }
  }

  // Gerar favicon.ico (usando 32x32)
  try {
    await sharp(Buffer.from(svgContent))
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    console.log('✅ favicon.ico');
  } catch (error) {
    console.error('❌ Erro ao gerar favicon.ico:', error.message);
  }

  console.log('\n🎉 Ícones gerados com sucesso!');
}

generateIcons();
