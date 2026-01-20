# 🐾 SOS Pet v2

Plataforma completa para serviços pet e achados & perdidos - MVP otimizado para Vercel.

## 🚀 Status do Projeto

✅ **PRONTO PARA PRODUÇÃO**
- Build: ✅ Validado
- Segurança: ✅ Auditado
- Performance: ✅ Otimizado
- Deploy: ✅ Automatizado

## 📋 Documentação

- **[DEPLOY.md](./DEPLOY.md)** - Guia completo de deploy na Vercel
- **[SECURITY.md](./SECURITY.md)** - Checklist de segurança
- **[AUDITORIA.md](./AUDITORIA.md)** - Relatório técnico da auditoria

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.1.4 (App Router + Turbopack)
- **UI**: React 19.2.3 + Tailwind CSS 4
- **Auth**: Supabase Auth (PKCE Flow)
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **TypeScript**: 5.9.3

## 🔐 Segurança Implementada

✅ **Autenticação Robusta**
- Interceptor automático de erros de refresh token
- Limpeza automática de sessões inválidas
- Proteção contra loops de redirect
- PKCE Flow para maior segurança

✅ **Variáveis de Ambiente**
- Validação automática de variáveis obrigatórias
- Proteção contra exposição de chaves sensíveis
- .gitignore configurado corretamente

✅ **Prevenção de Memory Leaks**
- Todos os useEffect com cleanup functions
- Event listeners removidos corretamente
- Subscriptions desinscritas adequadamente

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# 1. Clonar o repositório
git clone <seu-repo>
cd sos-pet-v2

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Executar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000

### Deploy em Produção

```bash
# 1. Verificar se está tudo OK
npm run deploy:check

# 2. Fazer commit e push
git add .
git commit -m "feat: ready for production"
git push

# A Vercel fará o deploy automaticamente
```

## 📦 Scripts Disponíveis

```bash
npm run dev              # Desenvolvimento local
npm run build           # Build de produção
npm run start           # Servidor de produção
npm run typecheck       # Verificação de tipos TypeScript
npm run deploy:check    # Checklist completo pré-deploy
./pre-deploy.sh         # Script de validação shell
```

## 🔑 Variáveis de Ambiente Necessárias

Configure na Vercel (Settings → Environment Variables):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Opcional
```

## 🎯 Funcionalidades Principais

- 🔍 **Achados & Perdidos** - Sistema completo de pets perdidos/encontrados
- 🏥 **Serviços Pet** - Busca de veterinários, pet shops, hotéis
- 🚨 **FAB de Emergência** - Acesso rápido a serviços 24h
- 👤 **Autenticação** - Sistema robusto com Supabase
- 📱 **PWA** - Instalável como app nativo
- 🗺️ **Mapas** - Localização de pets e serviços

## 🐛 Troubleshooting

### Erro: "Invalid Refresh Token"
✅ **JÁ CORRIGIDO** - Sistema limpa automaticamente e redireciona

### Build falha localmente
- Verifique conexão com internet (fonts do Google)
- Execute: `npm run build` novamente

### Erro de variáveis de ambiente
- Verifique se `.env.local` existe
- Confirme que todas as variáveis obrigatórias estão preenchidas

Para mais detalhes, consulte [DEPLOY.md](./DEPLOY.md)

## 📊 Estrutura do Projeto

```
sos-pet-v2/
├── src/
│   ├── app/              # Páginas (App Router)
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Context API (Auth)
│   ├── lib/              # Utilitários e config
│   └── services/         # Camada de serviços
├── public/               # Assets estáticos
├── .env.example          # Template de variáveis
├── DEPLOY.md            # Guia de deploy
├── SECURITY.md          # Segurança
└── AUDITORIA.md         # Relatório técnico
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

Para questões sobre deploy ou segurança:
1. Consulte [DEPLOY.md](./DEPLOY.md)
2. Verifique [AUDITORIA.md](./AUDITORIA.md)
3. Abra uma issue no repositório

---

**Versão**: 2.0.0  
**Status**: Production Ready ✅  
**Última Auditoria**: Janeiro 2025
