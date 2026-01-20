# ⚙️ Configuração do Supabase para Produção

## 🔐 1. Configuração de Autenticação

### Authentication → URL Configuration

```
Site URL: https://seu-dominio.vercel.app
```

### Redirect URLs (adicionar todas):

```
https://seu-dominio.vercel.app/auth/callback
https://seu-dominio.vercel.app/
http://localhost:3000/auth/callback (para desenvolvimento)
http://localhost:3000/
```

### Authentication → Providers

✅ **Email**
- Habilite "Enable Email provider"
- Confirme "Enable Email Confirmations" (recomendado)

⚙️ **Configurações Avançadas** (Settings → Auth):
```
JWT Expiry: 3600 (1 hora)
Refresh Token Rotation: Enabled
Reuse Interval: 10 (segundos)
```

## 🔑 2. Obter Credenciais

### Project Settings → API

Copie as seguintes informações:

```bash
Project URL:
https://xxxxxxxxxxxxx.supabase.co

anon/public key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...

service_role key (NÃO EXPONHA):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI...
```

⚠️ **IMPORTANTE**:
- Use `anon key` no frontend (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- NUNCA exponha `service_role key` no código cliente

## 📊 3. Schema do Banco de Dados

### Tabelas Principais

#### `profiles` - Perfis de Usuários
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nome TEXT,
  telefone TEXT,
  cidade TEXT,
  tipo_usuario TEXT CHECK (tipo_usuario IN ('tutor', 'prestador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver próprio perfil"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar próprio perfil"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

#### `pets` - Pets Perdidos/Encontrados
```sql
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL,
  raca TEXT,
  descricao TEXT,
  foto_url TEXT,
  status TEXT CHECK (status IN ('perdido', 'encontrado', 'resolvido')),
  localizacao GEOGRAPHY(POINT),
  cidade TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pets são públicos para leitura"
ON pets FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Usuários podem criar pets"
ON pets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus pets"
ON pets FOR UPDATE
USING (auth.uid() = user_id);
```

#### `prestadores` - Serviços Pet
```sql
CREATE TABLE prestadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  descricao TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  emergencia_24h BOOLEAN DEFAULT FALSE,
  avaliacao DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE prestadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prestadores são públicos"
ON prestadores FOR SELECT
TO PUBLIC
USING (true);
```

## 🔒 4. Storage (Imagens de Pets)

### Criar Bucket

1. Ir para Storage
2. Criar novo bucket: `pet-images`
3. Configurar como **público**

### Políticas de Storage

```sql
-- Permitir upload de imagens autenticadas
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- Permitir leitura pública
CREATE POLICY "Imagens são públicas"
ON storage.objects FOR SELECT
TO PUBLIC
USING (bucket_id = 'pet-images');

-- Permitir delete apenas do próprio arquivo
CREATE POLICY "Usuários podem deletar próprias imagens"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🪝 5. Functions e Triggers (Opcional)

### Atualizar timestamp automaticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## ✅ 6. Checklist Final

- [ ] URL do site configurada no Supabase
- [ ] Redirect URLs adicionadas
- [ ] Email provider habilitado
- [ ] Tabelas criadas com RLS habilitado
- [ ] Bucket de storage criado e configurado
- [ ] Credenciais copiadas para a Vercel
- [ ] Teste de autenticação realizado

## 🧪 7. Testar Configuração

Execute estes comandos no SQL Editor do Supabase:

```sql
-- Verificar RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar políticas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Testar inserção de perfil
INSERT INTO profiles (id, nome, tipo_usuario)
VALUES (auth.uid(), 'Teste', 'tutor')
RETURNING *;
```

## 📚 Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Docs](https://supabase.com/docs/guides/storage)

---

**Nota**: Adapte o schema conforme necessário para seu projeto específico.
