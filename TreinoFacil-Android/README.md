# TreinoFácil Fit — Versão Android (WebView)

Este é um app Android que empacota o sistema web existente (TreinoFácil Fit) dentro de um WebView.

## Como gerar o APK

1. Instale o **Android Studio** (https://developer.android.com/studio).
2. No Android Studio: **File → Open** e selecione a pasta `TreinoFacil-Android`.
3. Aguarde o Gradle sincronizar (ele baixa o Android SDK e as dependências automaticamente).
4. Com o emulador ou celular conectado (depuração USB ligada), clique em **Run ▶**.

Para gerar o APK para instalar no celular:
- **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- O APK ficará em: `app\build\outputs\apk\debug\app-debug.apk`

## Onde ficam os arquivos do sistema

Os arquivos web (`index.html`, `app.js`, `styles.css`) estão em:

```
app/src/main/assets/www/
```

Quando você alterar o site, copie `index.html`, `app.js` e `styles.css` novamente para essa pasta e reconstrua o app.

## Integrando IA no sistema

O app já inclui um painel de assistente IA dentro do WebView. Ele funciona em dois modos:

1. Modo local (padrão): usa regras do aplicativo e do plano do usuário para gerar recomendações de treino sem depender de chave externa.
2. Modo com backend seguro: basta preencher o endpoint do backend no painel `🤖 IA Coach` dentro do app.

Exemplo de endpoint recomendado para o backend FastAPI:

```
http://localhost:8000/api/coach
```

Backend pronto em: `treinofacil-backend/`

Para rodar o backend:

```
cd treinofacil-backend
python -m pip install -r requirements.txt
copy .env.example .env
python app.py
```

Ou no Windows:

```
run_backend.bat
```

Se quiser usar OpenAI diretamente no app, use um endpoint compatível com OpenAI:

```
https://api.openai.com/v1/chat/completions
```

Mas a recomendação mais segura é deixar a chave somente no backend.

## Observações

- Login, ficha e plano semanal funcionam via `localStorage` (habilitado no WebView).
- Os vídeos do YouTube e imagens externas abrem dentro do app (requer internet).
- O botão de voltar do Android navega no app quando possível.
