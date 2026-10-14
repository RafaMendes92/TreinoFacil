# TreinoFácil IA backend

## Iniciar localmente

1. Copie `.env.example` para `.env`
2. Ajuste as variáveis de ambiente
3. Execute:

```bash
npm install
node server.js
```

## Rotas

- GET `/health`
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/coach`

## Cadastro e Login

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"usuario@email.com","senha":"123456"}'
```

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","senha":"123456"}'
```

Resposta:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "nome": "João",
    "email": "usuario@email.com"
  }
}
```

Use o token no header:

```http
Authorization: Bearer <token>
```

## Chamada da IA

```bash
curl -X POST http://localhost:8000/api/coach \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -H "X-API-Key: treinofacil-demo-key" \
  -d '{"message":"Quero ganhar massa muscular","user":{"nome":"João","email":"usuario@email.com"},"plan":{"objetivo":"Ganhar força","nivel":"Intermediário","areas":[]}}'
```

## Deploy no Render

O repositório já inclui `render.yaml` e `DEPLOY_RENDER.md` com o passo a passo completo.

## Persistência local

Os usuários ficam em SQLite local em `data/treinofacil.db`.

## Segurança

- JWT obrigatório para `/api/coach`
- API key opcional para app-to-app
- Rate limit por IP
- CORS e payload sanitizado
- Senhas com hash PBKDF2 + salt
