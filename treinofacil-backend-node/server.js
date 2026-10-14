require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = Number(process.env.PORT || 8000);
const appApiKey = process.env.APP_API_KEY || '';
const jwtSecret = process.env.JWT_SECRET || 'treinofacil-dev-secret';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const rateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 60);
const rateMap = new Map();
const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'treinofacil.db');
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: allowedOrigins.includes('*') || allowedOrigins.length === 0 ? true : allowedOrigins,
  credentials: true,
}));

function sanitizeString(value) {
  return typeof value === 'string' ? value.trim().slice(0, 2000) : '';
}

function normalizeEmail(value) {
  return sanitizeString(value || '').toLowerCase();
}

function ensureUserStore() {
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

function initDatabase() {
  ensureUserStore();
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [normalizeEmail(email)], (error, row) => {
      if (error) return reject(error);
      return resolve(row || null);
    });
  });
}

function createUserRecord({ nome, email, senha }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(String(senha), salt, 100000, 64, 'sha512').toString('hex');
  const user = {
    id: crypto.randomUUID(),
    nome: sanitizeString(nome),
    email: normalizeEmail(email),
    senha_hash: hash,
    salt,
    created_at: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (id, nome, email, senha_hash, salt, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.nome, user.email, user.senha_hash, user.salt, user.created_at],
      function (error) {
        if (error) return reject(error);
        return resolve({ ...user, senha_hash: user.senha_hash, salt: user.salt });
      }
    );
  });
}

function verifyPassword(candidate, user) {
  const inputHash = crypto.pbkdf2Sync(String(candidate), user.salt, 100000, 64, 'sha512').toString('hex');
  if (!user.senha_hash) return false;
  const expected = Buffer.from(user.senha_hash, 'hex');
  const actual = Buffer.from(inputHash, 'hex');
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, nome: user.nome, role: 'user' }, jwtSecret, { expiresIn: jwtExpiresIn });
}

function ensureApiKey(req, res, next) {
  if (!appApiKey) return next();

  const headerValue = req.headers['x-api-key'];
  const authHeader = req.headers.authorization || '';
  const provided = typeof headerValue === 'string' ? headerValue : (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '');

  if (provided !== appApiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}

function requireJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function enforceRateLimit(req, res, next) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = rateMap.get(ip) || { count: 0, resetAt: now + rateLimitWindowMs };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + rateLimitWindowMs;
  }

  bucket.count += 1;
  rateMap.set(ip, bucket);

  if (bucket.count > rateLimitMaxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  return next();
}

app.use(enforceRateLimit);

const BASE_TREINOS = {
  1: { nome: 'Peito e Tríceps', descricao: 'Peito, tríceps e estabilidade', exercicios: [
    { nome: 'Supino Reto', series: '4x10', grupo: 'Peito' },
    { nome: 'Supino Inclinado', series: '3x10', grupo: 'Peito' },
    { nome: 'Crucifixo', series: '3x12', grupo: 'Peito' },
    { nome: 'Tríceps Pulley', series: '3x12', grupo: 'Tríceps' },
    { nome: 'Tríceps Francês', series: '3x12', grupo: 'Tríceps' }
  ] },
  2: { nome: 'Costas e Bíceps', descricao: 'Costas, bíceps e postura', exercicios: [
    { nome: 'Puxada Frontal', series: '4x10', grupo: 'Costas' },
    { nome: 'Remada Curvada', series: '4x10', grupo: 'Costas' },
    { nome: 'Rosca Direta', series: '3x10', grupo: 'Bíceps' },
    { nome: 'Rosca Martelo', series: '3x12', grupo: 'Bíceps' },
    { nome: 'Levantamento Terra', series: '3x8', grupo: 'Costas' }
  ] },
  4: { nome: 'Pernas', descricao: 'Quadríceps, glúteos e panturrilhas', exercicios: [
    { nome: 'Agachamento', series: '4x8', grupo: 'Quadríceps' },
    { nome: 'Leg Press', series: '4x10', grupo: 'Pernas' },
    { nome: 'Cadeira Extensora', series: '3x12', grupo: 'Quadríceps' },
    { nome: 'Stiff', series: '3x10', grupo: 'Posterior' },
    { nome: 'Panturrilha', series: '4x15', grupo: 'Panturrilha' }
  ] },
  5: { nome: 'Ombros e Core', descricao: 'Ombros, braços e tronco', exercicios: [
    { nome: 'Desenvolvimento', series: '4x10', grupo: 'Ombros' },
    { nome: 'Elevação Lateral', series: '4x12', grupo: 'Ombros' },
    { nome: 'Elevação Frontal', series: '3x12', grupo: 'Ombros' },
    { nome: 'Prancha', series: '3x1min', grupo: 'Core' },
    { nome: 'Abdominal Oblíquo', series: '3x12', grupo: 'Core' }
  ] },
  6: { nome: 'Full Body / Cardio', descricao: 'Esforço total e condicionamento', exercicios: [
    { nome: 'Burpee', series: '4x12', grupo: 'Funcional' },
    { nome: 'Polichinelo', series: '3x30s', grupo: 'Cardio' },
    { nome: 'Flexão', series: '4x12', grupo: 'Peito' },
    { nome: 'Mountain Climber', series: '3x30s', grupo: 'Core' },
    { nome: 'Pular Corda', series: '4x1min', grupo: 'Cardio' }
  ] }
};

function buildLocalResponse({ message, user, plan }) {
  const nome = (user && user.nome) ? String(user.nome).split(' ')[0] : 'Atleta';
  const objetivo = (plan && plan.objetivo) ? plan.objetivo : 'condicionamento físico e saúde';
  const nivel = (plan && plan.nivel) ? plan.nivel : 'intermediário';
  const text = String(message || '').toLowerCase();

  if (text.includes('cardio') || text.includes('aerób') || text.includes('corrida') || text.includes('esteira') || text.includes('bike') || text.includes('bicicleta') || text.includes('pular corda')) {
    const nivelNorm = String(nivel).toLowerCase();
    const minutos = nivelNorm.includes('iniciante') ? 20 : nivelNorm.includes('avançado') ? 45 : 30;
    const sugestao = nivelNorm.includes('iniciante') ? 'caminhada rápida ou bike' : 'intervalos leves de corrida, bike ou corda';
    const tempoPlano = plan && plan.tempo ? Number(plan.tempo) : 30;
    return `${nome}, indico ${minutos} min de cardio moderado (${sugestao}), respeitando sua meta de ${tempoPlano} min/treino.`;
  }
  if (text.includes('quanto tempo') || text.includes('tempo') || text.includes('minutos') || text.includes('dura')) {
    const nivelNorm = String(nivel).toLowerCase();
    const tempoPlano = plan && plan.tempo ? Number(plan.tempo) : 45;
    const faixaCardio = nivelNorm.includes('iniciante') ? '15 a 20' : nivelNorm.includes('avançado') ? '40 a 60' : '20 a 30';
    return `${nome}, mire sessões de ~${tempoPlano} min: 5 a 10 min de aquecimento, 30 a 40 de treino e 5 de alongamento. Cardio: ${faixaCardio} min.`;
  }
  if (text.includes('dor') || text.includes('lesão') || text.includes('restrição') || text.includes('recupera')) {
    return `${nome}, reduza a carga em 10% a 15% e evite movimentos que forcem a região afetada. Dor persistente deve ser avaliada por um profissional.`;
  }

  const topicos = [
    { k: ['aquec'], r: 'Aqueça 5 a 10 min: caminhada, polichinelos, mobilidade e séries leves do primeiro exercício.' },
    { k: ['descanso'], r: 'Entre séries: 60 a 90s para força e 30 a 60s para cardio. Durma 7 a 8h por noite.' },
    { k: ['along'], r: 'Alongue 5 a 10 min após o treino, segurando cada posição 20 a 30s, sem forçar.' },
    { k: ['água', 'agua', 'hidrata'], r: 'Beba cerca de 2L de água por dia e alguns goles a cada 15-20 min durante o treino.' },
    { k: ['dieta', 'aliment', 'nutri', 'comer'], r: 'Priorize proteínas magras, carboidratos complexos e vegetais; faça uma refeição leve 1-2h antes do treino.' },
    { k: ['emagrecer', 'perder', 'gordura', 'definir'], r: 'Mantenha intensidade moderada, descansos curtos e adicione cardio em dias alternados.' },
    { k: ['massa', 'força', 'ganhar'], r: 'Use 3 a 4 séries por exercício, descanso de 60 a 90s e aumente a carga aos poucos.' },
    { k: ['overtraining', 'excesso de treino', 'treinar todo dia', 'todos os dias'], r: 'Treine cada músculo 2 a 3x por semana, alterne dias intensos e leves e respeite sinais de fadiga.' },
    { k: ['frequência', 'frequencia', 'quantas vezes', 'dias de treino'], r: 'Para hipertrofia, 3 a 5 treinos por semana; iniciantes podem começar com 3.' },
    { k: ['resultado', 'ganho de músculo', 'defini', 'quanto tempo pra', 'quanto tempo para'], r: 'Ganhos de força em 3 a 4 semanas; mudança visual em 2 a 3 meses com treino, descanso e proteína.' },
    { k: ['peito', 'peitoral', 'supino'], r: 'Peito: supino reto/inclinado + crucifixo ou flexão, 3 a 4 séries de 8 a 12 reps.' },
    { k: ['costas', 'remada', 'puxada'], r: 'Costas: puxada frontal/barra fixa + remada curvada/baixa, 3 a 4 séries de 8 a 12 reps.' },
    { k: ['perna', 'agachamento', 'glúteo', 'gluteo', 'quadríceps', 'posterior', 'panturrilha', 'stiff', 'leg press'], r: 'Pernas: agachamento/leg press + stiff, 3 a 4 séries de 8 a 12 reps; panturrilha em amplitude total.' },
    { k: ['ombro', 'desenvolvimento', 'elev'], r: 'Ombros: desenvolvimento para força + elevação lateral, com execução controlada e sem compensar com a lombar.' },
    { k: ['bíceps', 'biceps', 'rosca'], r: 'Bíceps: rosca direta + martelo/concentrada, cotovelos firmes e volta controlada.' },
    { k: ['tríceps', 'triceps', 'mergulho', 'dips'], r: 'Tríceps: pulley + testa/francês, extensão completa, 60 a 90s de descanso.' },
    { k: ['abdômen', 'abdomen', 'barriga', 'core', 'prancha'], r: 'Abdômen: supra, infra, prancha e oblíquos em 3 a 4 séries; prancha de 30 a 60s.' },
    { k: ['musculação', 'musculacao', 'academia', 'treino de força'], r: 'Use 1 a 2 exercícios compostos por grupo muscular, 3 a 4 séries de 8 a 12 reps, progressão semanal e 48h de descanso por grupo.' }
  ];

  let melhor = null, melhorScore = 0;
  topicos.forEach(t => {
    const s = t.k.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    if (s > melhorScore) { melhorScore = s; melhor = t; }
  });

  if (melhor) return `${nome}, ${melhor.r}`;
  return `${nome}, foque em execução correta, progressão semanal de carga e 7 a 8h de sono.`;
}

function buildWorkoutPlanFromRequest({ plan, user }) {
  const objetivo = sanitizeString(plan?.objetivo || 'Ganhar força');
  const nivel = sanitizeString(plan?.nivel || 'Intermediário');
  const diasSem = Number(plan?.diasSem || plan?.dias || 3);
  const tempo = Number(plan?.tempo || 45);
  const lesao = Boolean(plan?.lesao);
  const areas = Array.isArray(plan?.areas) ? plan.areas.map(v => sanitizeString(v)).filter(Boolean) : [];
  const imc = Number(plan?.peso && plan?.altura ? (plan.peso / ((plan.altura / 100) ** 2)).toFixed(1) : 0) || 0;
  const agendaMap = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 6], 6: [1, 2, 3, 4, 5, 6] };
  const seqMap = { ab: [0, 1], abc: [0, 1, 2], abcd: [0, 1, 2, 3], full: [4] };
  const divisao = sanitizeString(plan?.divisao || (diasSem === 2 ? 'full' : diasSem === 3 ? 'abc' : diasSem === 4 ? 'abcd' : diasSem === 5 ? 'abcd' : 'abc'));
  const agenda = agendaMap[diasSem] || [1, 3, 5];
  const seq = seqMap[divisao] || [0, 1, 2];
  const seriesBase = objetivo.toLowerCase().includes('força') ? '4x8' : objetivo.toLowerCase().includes('resist') ? '3x15' : objetivo.toLowerCase().includes('condicion') ? '3x12' : '4x10';
  const nEx = tempo <= 30 ? 4 : tempo <= 45 ? 5 : tempo <= 60 ? 6 : 7;
  const treinos = {};

  agenda.forEach((dia, idx) => {
    const tipoIndex = seq[idx % seq.length];
    const tipo = (tipoIndex === 0 ? 1 : tipoIndex === 1 ? 2 : tipoIndex === 2 ? 4 : tipoIndex === 3 ? 5 : 6);
    const base = BASE_TREINOS[tipo] || BASE_TREINOS[1];
    const exercicios = base.exercicios.slice(0, nEx).map((e) => ({ ...e, series: e.series || seriesBase }));
    treinos[dia] = {
      nome: base.nome,
      descricao: `${objetivo} • ${nivel} • ${tempo} min${lesao ? ` • ajuste para ${areas.join(', ') || 'restrição'}` : ''}`,
      exercicios
    };
  });

  return {
    divisao,
    diasSem,
    objetivo,
    nivel,
    idade: Number(plan?.idade || 30),
    tempo,
    lesao,
    areas,
    peso: Number(plan?.peso || 70),
    altura: Number(plan?.altura || 175),
    imc,
    treinos
  };
}

async function callOpenAI({ message, user, plan }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return buildLocalResponse({ message, user, plan });

  const model = process.env.MODEL || 'gpt-4o-mini';
  const payload = {
    model,
    messages: [
      {
        role: 'system',
        content: 'Você é um coach de fitness e personal trainer. Responda em português do Brasil, de forma CURTA e DIRETA (máx. 3 a 4 frases), com foco em treino, recuperação e progressão. Responda exatamente a pergunta, sem introduções longas.'
      },
      {
        role: 'user',
        content: `Pergunta do usuário: ${message}\n\nDados do usuário: ${JSON.stringify(user || {})}\n\nDados do plano: ${JSON.stringify(plan || {})}`
      }
    ],
    temperature: 0.7,
    max_tokens: 220
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return buildLocalResponse({ message, user, plan });
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || buildLocalResponse({ message, user, plan });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', async (req, res) => {
  const { nome, email, senha } = req.body || {};
  const safeNome = sanitizeString(nome || '');
  const safeEmail = normalizeEmail(email || '');
  const safeSenha = sanitizeString(senha || '');

  if (!safeNome || !safeEmail || !safeSenha || safeSenha.length < 4) {
    return res.status(400).json({ error: 'nome, email and senha are required' });
  }

  try {
    const existing = await getUserByEmail(safeEmail);
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = await createUserRecord({ nome: safeNome, email: safeEmail, senha: safeSenha });
    const token = createToken(newUser);
    return res.json({
      token,
      user: { id: newUser.id, nome: newUser.nome, email: newUser.email }
    });
  } catch (error) {
    console.error('Register user failed:', error);
    return res.status(500).json({ error: 'Register failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body || {};
  const safeEmail = normalizeEmail(email || '');
  const safeSenha = sanitizeString(senha || '');

  if (!safeEmail || !safeSenha) {
    return res.status(400).json({ error: 'email and senha are required' });
  }

  try {
    const user = await getUserByEmail(safeEmail);
    if (!user || !verifyPassword(safeSenha, user)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.json({
      token,
      user: { id: user.id, nome: user.nome, email: user.email }
    });
  } catch (error) {
    console.error('Login user failed:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/coach', ensureApiKey, requireJwt, async (req, res) => {
  const { message, user, plan, generatePlan } = req.body || {};
  const safeMessage = sanitizeString(message);

  if (!safeMessage && !generatePlan) {
    return res.status(400).json({ error: 'message is required' });
  }

  const safeUser = user && typeof user === 'object' ? {
    nome: sanitizeString(user.nome),
    email: sanitizeString(user.email),
  } : { email: sanitizeString(req.user?.email || '') };

  const safePlan = plan && typeof plan === 'object' ? {
    objetivo: sanitizeString(plan.objetivo),
    nivel: sanitizeString(plan.nivel),
    areas: Array.isArray(plan.areas) ? plan.areas.map(v => sanitizeString(v)).filter(Boolean).slice(0, 10) : [],
    diasSem: Number(plan.diasSem || plan.dias || 3),
    tempo: Number(plan.tempo || 45),
    idade: Number(plan.idade || 30),
    peso: Number(plan.peso || 70),
    altura: Number(plan.altura || 175),
    divisao: sanitizeString(plan.divisao),
    lesao: Boolean(plan.lesao)
  } : {};

  const planned = generatePlan ? buildWorkoutPlanFromRequest({ plan: safePlan, user: safeUser }) : null;
  const response = await callOpenAI({ message: safeMessage, user: safeUser, plan: safePlan });

  if (planned) {
    return res.json({ response, plan: planned });
  }

  res.json({ response });
});

initDatabase();
app.listen(port, () => {
  console.log(`TreinoFácil backend running on http://localhost:${port}`);
});
