# 🚀 Guia de Deploy - SOS Pet v2

## ✅ Pré-requisitos

1. **Conta Vercel** - [vercel.com](https://vercel.com)
2. **Projeto Supabase configurado** - [supabase.com](https://supabase.com)
3. **Git repository** - GitHub, GitLab ou Bitbucket

## 📋 Checklist Pré-Deploy

### 1. Variáveis de Ambiente

Configure estas variáveis na Vercel (Settings → Environment Variables):

```bash
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URL (OBRIGATÓRIO para autenticação)
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app

# Google Analytics (OPCIONAL)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Configuração do Supabase

No painel do Supabase, configure:

1. **Authentication → URL Configuration**
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/auth/callback`

2. **Authentication → Providers**
   - Habilite Email/Password
   - Configure PKCE flow

### 3. Teste Local

```bash
# Instalar dependências
npm install

# Verificar tipos
npm run typecheck

# Testar build
npm run build

# OU executar checklist completo
npm run deploy:check
```

## 🔄 Deploy na Vercel

### Método 1: Deploy Automático (Recomendado)

1. Conecte seu repositório Git à Vercel
2. Configure as variáveis de ambiente
3. Faça push para a branch `main`:

```bash
git add .
git commit -m "feat: production ready"
git push origin main
```

4. Vercel detecta automaticamente e faz o deploy

### Método 2: Deploy Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🐛 Solução de Problemas

### Erro: "Invalid Refresh Token"
✅ **JÁ CORRIGIDO** - O interceptor automático limpa a sessão e redireciona

### Build falha com erro de fonts
**Problema**: Conexão com Google Fonts durante build

**Solução**: 
- Build funciona normalmente na Vercel (tem conexão estável)
- Localmente, aguarde alguns segundos e tente novamente
- Ou use fontes system como fallback temporário

### Erro: "Module not found @/..."
✅ **JÁ CORRIGIDO** - tsconfig.json configurado com paths

### Redirect loop no login
✅ **JÁ CORRIGIDO** - Proteção contra loops implementada

## 📊 Monitoramento Pós-Deploy

1. **Vercel Dashboard** - Monitorar builds e erros
2. **Supabase Dashboard** - Verificar autenticações
3. **Console do navegador** - Checar erros em produção

## 🔐 Segurança

- ✅ Todas as chaves sensíveis em variáveis de ambiente
- ✅ .env.local no .gitignore
- ✅ PKCE flow habilitado
- ✅ Interceptor de erros de auth
- ✅ Proteção contra loops de redirect

## 🆘 Suporte

Se encontrar problemas:

1. Verifique logs na Vercel: `vercel logs`
2. Verifique configuração do Supabase
3. Confirme que todas as variáveis de ambiente estão configuradas
4. Consulte [SECURITY.md](./SECURITY.md) para checklist de segurança

## 📝 Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Verificação de tipos
npm run typecheck

# Build de produção
npm run build

# Checklist completo pre-deploy
npm run deploy:check

# Ver logs da Vercel
vercel logs

# Rollback para versão anterior
vercel rollback
```

---

**Última atualização**: $(date +%Y-%m-%d)
**Versão**: 2.0.0
**Status**: Production Ready ✅
