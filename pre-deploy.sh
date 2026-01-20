#!/bin/bash

# Pre-Deploy Check Script
# Garante que o projeto está pronto para deploy na Vercel

set -e  # Exit on error

echo "🔍 SOS Pet - Pre-Deploy Check"
echo "================================"
echo ""

# 1. Check environment variables
echo "📋 Verificando variáveis de ambiente..."
if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
  echo "⚠️  AVISO: Nenhum arquivo .env encontrado localmente"
  echo "    Certifique-se de configurar as variáveis na Vercel:"
  echo "    - NEXT_PUBLIC_SUPABASE_URL"
  echo "    - NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "    - NEXT_PUBLIC_SITE_URL"
  echo ""
fi

# 2. TypeScript type checking
echo "🔧 Executando verificação de tipos TypeScript..."
if ! npm run typecheck; then
  echo "❌ ERRO: Falha na verificação de tipos"
  echo "   Corrija os erros de tipo antes de fazer deploy"
  exit 1
fi
echo "✅ Tipos OK"
echo ""

# 3. Build test
echo "🏗️  Executando build de produção..."
if ! npm run build; then
  echo "❌ ERRO: Build falhou"
  echo "   Corrija os erros de compilação antes de fazer deploy"
  exit 1
fi
echo "✅ Build OK"
echo ""

# 4. Security audit
echo "🔒 Auditando segurança..."
echo "   Verificando se .env.local está no .gitignore..."
if grep -q ".env.local" .gitignore; then
  echo "✅ .env.local está protegido"
else
  echo "⚠️  AVISO: Adicione .env.local ao .gitignore"
fi
echo ""

# 5. Final check
echo "================================"
echo "✅ PRÉ-DEPLOY CONCLUÍDO COM SUCESSO!"
echo ""
echo "📦 Próximos passos:"
echo "   1. git add ."
echo "   2. git commit -m 'feat: ready for production deploy'"
echo "   3. git push"
echo ""
echo "🚀 A Vercel iniciará o deploy automaticamente"
echo "================================"
