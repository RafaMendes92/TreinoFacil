# Deploy no Render

## 1) Preparar o projeto

O backend já está pronto em `treinofacil-backend-node` e usa Express + JWT + SQLite.

## 2) Criar o Web Service no Render

1. Acesse https://dashboard.render.com
2. Clique em `New` → `Web Service`
3. Conecte este repositório
4. Selecione o diretório: `treinofacil-backend-node`
5. Use:
   - Build Command: `npm install`
   - Start Command: `node server.js`

## 3) Configurar variáveis

Copie os valores do arquivo `.env.production.example` e ajuste:

```env
OPENAI_API_KEY=sua_chave_real
APP_API_KEY=uma_chave_forte_aleatoria
JWT_SECRET=uma_chave_jwt_aleatoria
JWT_EXPIRES_IN=8h
PORT=10000
MODEL=gpt-4o-mini
ALLOWED_ORIGINS=https://seuapp.com,https://www.seuapp.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
```

## 4) URL pública

Depois do deploy, a API ficará disponível em algo como:

```text
https://treinofacil-ai-backend.onrender.com
```

## 5) Configurar no app

No painel IA do app, use:

- Endpoint: `https://treinofacil-ai-backend.onrender.com/api/coach`
- Chave da API: o mesmo valor do `APP_API_KEY`

## 6) Observação importante

O SQLite é bom para início, mas, em produção, o ideal é migrar para PostgreSQL para persistência mais estável em um ambiente de container.
