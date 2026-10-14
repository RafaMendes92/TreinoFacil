const VIDEO = {
  supinoReto: 'fG_03xSzT2s', supinoInclinado: 'wkUemXl4vFI', crucifixo: '9BEQWr0u-ac',
  tricepsPulley: 'HFs7OiOy8TE', tricepsTesta: 'cIqScmVpqnc', puxadaFrontal: 'epbnBUzjJ2U',
  remadaCurvada: 'SbuXAFpDUkI', remadaBaixa: 'zw0lUIPCq-U', roscaDireta: '0T7V5o9ypUw',
  roscaMartelo: 'GilFwBs_kOs', agachamento: '4L5nBs8Eq7g', legPress: 'EotSw18oR9w',
  extensora: 'PzIfB9MiiX8', stiff: 'VV0YIQc04B8', panturrilha: 'EILF4iyBxSQ',
  desenvolvimento: 'DFXtzdXN_iY', lateral: 'IwWvZ0rlNXs', frontal: 'F6toacmeUlA',
  prancha: 'uxPlAbWFUDs', crunch: 'P5ySsdvCMyE', burpee: 'auBLPXO8Fww',
  polichinelo: '-ee0kl49foM', flexao: 'w1O51Nq1JaI', mountain: 'kLh-uczlPLg'
};

const treinos = {
  1: { nome: 'Peito e Tríceps', descricao: 'Supino, crucifixo e extensões para evolução de força.', exercicios: [
    { nome: 'Supino Reto', series: '4x10', grupo: 'Peito', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.supinoReto },
    { nome: 'Supino Inclinado com Halteres', series: '3x12', grupo: 'Peito', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.supinoInclinado },
    { nome: 'Crucifixo Máquina', series: '3x12', grupo: 'Peito', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.crucifixo },
    { nome: 'Supino Máquina', series: '3x12', grupo: 'Peito', img: '', videoId: '' },
    { nome: 'Supino Inclinado Máquina', series: '3x12', grupo: 'Peito', img: '', videoId: '' },
    { nome: 'Supino Declinado Máquina', series: '3x12', grupo: 'Peito', img: '', videoId: '' },
    { nome: 'Tríceps Pulley', series: '4x12', grupo: 'Tríceps', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.tricepsPulley },
    { nome: 'Tríceps Testa', series: '3x10', grupo: 'Tríceps', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.tricepsTesta } ] },
  2: { nome: 'Costas e Bíceps', descricao: 'Puxadas e remas para costas fortes e postura.', exercicios: [
    { nome: 'Puxada Frontal', series: '4x10', grupo: 'Costas', img: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.puxadaFrontal },
    { nome: 'Remada Curvada', series: '4x10', grupo: 'Costas', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.remadaCurvada },
    { nome: 'Remada Baixa', series: '3x12', grupo: 'Costas', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.remadaBaixa },
    { nome: 'Rosca Direta', series: '4x10', grupo: 'Bíceps', img: 'https://images.unsplash.com/photo-1529366825943-3005b026d636?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.roscaDireta },
    { nome: 'Rosca Martelo', series: '3x12', grupo: 'Bíceps', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.roscaMartelo } ] },
  4: { nome: 'Pernas', descricao: 'Agachamento, leg press e afundo para pernas completas.', exercicios: [
    { nome: 'Agachamento Livre', series: '4x10', grupo: 'Quadríceps', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.agachamento },
    { nome: 'Leg Press', series: '4x12', grupo: 'Pernas', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.legPress },
    { nome: 'Cadeira Extensora', series: '3x15', grupo: 'Quadríceps', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.extensora },
    { nome: 'Stiff', series: '3x12', grupo: 'Posterior', img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.stiff },
    { nome: 'Panturrilha em Pé', series: '4x15', grupo: 'Panturrilha', img: 'https://images.unsplash.com/photo-1573107823960-ca7b6e69a4c6?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.panturrilha } ] },
  5: { nome: 'Ombros e Abdômen', descricao: 'Desenvolvimento e elevações, mais core forte.', exercicios: [
    { nome: 'Desenvolvimento com Halteres', series: '4x10', grupo: 'Ombros', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.desenvolvimento },
    { nome: 'Elevação Lateral', series: '4x12', grupo: 'Ombros', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.lateral },
    { nome: 'Elevação Frontal', series: '3x12', grupo: 'Ombros', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.frontal },
    { nome: 'Prancha', series: '3x1min', grupo: 'Abdominal', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.prancha },
    { nome: 'Crunch Abdominal', series: '4x15', grupo: 'Abdominal', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.crunch } ] },
  6: { nome: 'Full Body / Cardio', descricao: 'Treino funcional e cardio para queimar calorias.', exercicios: [
    { nome: 'Burpee', series: '4x12', grupo: 'Funcional', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.burpee },
    { nome: 'Polichinelo', series: '4x30s', grupo: 'Cardio', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.polichinelo },
    { nome: 'Flexão de Braço', series: '4x12', grupo: 'Peito', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.flexao },
    { nome: 'Mountain Climber', series: '4x30s', grupo: 'Abdominal', img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=70', videoId: VIDEO.mountain } ] }
};

const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const hoje = new Date();
let diaAtual = hoje.getDay();

// ===== Feitos do plano semanal =====
function getFeitosPlano() {
  const u = getUser(); if (!u) return {};
  return JSON.parse(localStorage.getItem('ft_feitos_' + u.email) || '{}');
}
function saveFeitosPlano(f) {
  const u = getUser();
  localStorage.setItem('ft_feitos_' + u.email, JSON.stringify(f));
}
function toggleFeitoPlano(dia, idx) {
  const f = getFeitosPlano();
  const k = dia + '_' + idx;
  f[k] = !f[k];
  saveFeitosPlano(f);
  selecionar(diaAtual, weekNav.children[diaAtual]);
}
// Escapa texto para evitar quebrar o HTML dos cards/banners
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Parâmetro seguro (sem aspas) para usar dentro de atributo HTML inline
function attrExercicio(e) {
  return encodeURIComponent(JSON.stringify({ nome: e.nome, grupo: e.grupo }));
}
function fallbackImg(e) {
  return `imgExercicio(JSON.parse(decodeURIComponent('${attrExercicio(e)}')))`;
}

// ===== Banner do treino: imagem de capa =====
function bannerTreinoHTML(t, subtitulo) {
  if (!t) return '';
  const exs = t.exercicios || [];
  const capa = exs.length ? (exs[0].img || imgExercicio(exs[0])) : imgExercicio({ nome: t.nome, grupo: 'default' });
  return `
  <div class="treino-banner">
    <img class="treino-banner-bg" src="${capa}" alt="" aria-hidden="true"
      onerror="this.onerror=null;this.style.display='none'">
    <div class="treino-banner-conteudo">
      <div class="treino-banner-topo">
        <span class="treino-badge">🏋️ ${exs.length} exercícios</span>
        ${subtitulo ? `<span class="treino-data">📅 ${esc(subtitulo)}</span>` : ''}
      </div>
      <h2>${esc(t.nome)}</h2>
      ${t.descricao ? `<p>${esc(t.descricao)}</p>` : ''}
    </div>
  </div>`;
}

function planoCardHTML(e, dia, i) {
  const feitos = getFeitosPlano();
  const feito = !!feitos[dia + '_' + i];
  return `
  <div class="card ${feito ? 'card-feito' : ''}">
    <img src="${e.img || imgExercicio(e)}" alt="${esc(e.nome)}" loading="lazy" onerror="this.onerror=null;this.src=${fallbackImg(e)}">
    <div class="card-body">
      <h3>${e.nome}</h3>
      <p>${e.grupo}</p>
      <div class="tags"><span class="tag">${e.series}</span><span class="tag">${e.grupo}</span>${feito ? '<span class="tag tag-feito">✓ Feito</span>' : ''}</div>
      <button class="btn" onclick="abrirVideo('${e.videoId || ''}', '${encodeURIComponent(e.nome)}')">▶ Vídeo do Exercício</button>
      <button class="btn ${feito ? 'btn-feito' : 'btn-marcar'}" onclick="toggleFeitoPlano(${dia}, ${i})">${feito ? '✓ Feito' : '○ Marcar como feito'}</button>
    </div>
  </div>`;
}

const $ = id => document.getElementById(id);
const weekNav = $('weekNav'), info = $('workoutInfo'), grid = $('exerciseGrid');
const modal = $('videoModal'), modalTitle = $('modalTitle'), videoFrame = $('videoFrame'), ytLink = $('ytLink');

// ===== Auth =====
function getUsers() { return JSON.parse(localStorage.getItem('ft_users') || '{}'); }
function getUser() { return JSON.parse(localStorage.getItem('ft_user') || 'null'); }

function cadastrar() {
  const nome = $('cadNome').value.trim();
  const email = $('cadEmail').value.trim().toLowerCase();
  const senha = $('cadSenha').value;
  if (!nome || !email || senha.length < 4) return alert('Preencha tudo (senha mínimo 4 caracteres).');
  const users = getUsers();
  if (users[email]) return alert('E-mail já cadastrado.');
  users[email] = { nome, email, senha };
  localStorage.setItem('ft_users', JSON.stringify(users));
  alert('Cadastro realizado! Faça login.');
  toggleAuth('login');
}

function login() {
  const email = $('logEmail').value.trim().toLowerCase();
  const senha = $('logSenha').value;
  const u = getUsers()[email];
  if (!u || u.senha !== senha) return alert('E-mail ou senha inválidos.');
  localStorage.setItem('ft_user', JSON.stringify(u));
  iniciarApp();
}

function logout() {
  localStorage.removeItem('ft_user');
  localStorage.removeItem('ft_backend_token');
  location.reload();
}

function getBackendConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem('ft_backend_cfg') || '{}');
    return {
      url: saved.url || 'http://localhost:8000',
      apiKey: saved.apiKey || 'treinofacil-demo-key'
    };
  } catch (e) {
    return { url: 'http://localhost:8000', apiKey: 'treinofacil-demo-key' };
  }
}

function getBackendToken() {
  return localStorage.getItem('ft_backend_token') || '';
}

async function syncBackendSession() {
  const u = getUser();
  if (!u || !u.email || !u.senha) return null;
  const { url, apiKey } = getBackendConfig();
  try {
    const loginRes = await fetch(url + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ email: u.email, senha: u.senha })
    });
    if (loginRes.ok) {
      const data = await loginRes.json();
      if (data && data.token) {
        localStorage.setItem('ft_backend_token', data.token);
        return data.token;
      }
    }

    const registerRes = await fetch(url + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
      body: JSON.stringify({ nome: u.nome, email: u.email, senha: u.senha })
    });
    if (registerRes.ok) {
      const data = await registerRes.json();
      if (data && data.token) {
        localStorage.setItem('ft_backend_token', data.token);
        return data.token;
      }
    }
  } catch (e) {
    console.warn('Backend indisponível; usando fallback local da IA/ficha.', e);
  }
  return null;
}

function normalizeReceivedPlan(rawPlan) {
  const treinos = rawPlan && rawPlan.treinos ? rawPlan.treinos : rawPlan || {};
  const normalized = { ...rawPlan };
  normalized.treinos = {};
  Object.keys(treinos).forEach((dia) => {
    const item = treinos[dia];
    normalized.treinos[dia] = {
      nome: item && item.nome ? item.nome : `Treino ${dia}`,
      descricao: item && item.descricao ? item.descricao : 'Ficha gerada pela IA',
      exercicios: Array.isArray(item && item.exercicios) ? item.exercicios.map((ex) => ({
        nome: ex && ex.nome ? ex.nome : 'Exercício',
        grupo: ex && ex.grupo ? ex.grupo : 'Geral',
        series: ex && ex.series ? ex.series : '3x12',
        img: ex && ex.img ? ex.img : '',
        videoId: ex && ex.videoId ? ex.videoId : ''
      })) : []
    };
  });
  return normalized;
}

async function gerarFichaComIA(payload) {
  const { url, apiKey } = getBackendConfig();
  const token = getBackendToken() || await syncBackendSession();
  if (!token) return null;

  try {
    const res = await fetch(url + '/api/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'X-API-Key': apiKey
      },
      body: JSON.stringify({
        message: `Gere uma ficha personalizada para este aluno com os dados informados.`,
        user: {
          nome: payload.nome || getUser()?.nome || 'Aluno',
          email: payload.email || getUser()?.email || 'aluno@treinofacil.app'
        },
        plan: payload,
        generatePlan: true
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.plan) return normalizeReceivedPlan(data.plan);
    return null;
  } catch (e) {
    console.warn('IA não conseguiu gerar a ficha. Usando fallback local.', e);
    return null;
  }
}

function toggleAuth(modo) {
  $('formLogin').style.display = modo === 'login' ? 'block' : 'none';
  $('formCadastro').style.display = modo === 'cadastro' ? 'block' : 'none';
  $('tabLogin').classList.toggle('active', modo === 'login');
  $('tabCadastro').classList.toggle('active', modo === 'cadastro');
}

// ===== App =====
function iniciarApp() {
  const u = getUser();
  $('userName').textContent = u.nome.charAt(0).toUpperCase() + u.nome.slice(1);
  $('authScreen').style.display = 'none';
  $('appScreen').style.display = 'block';
  renderNav();
  selecionar(hoje.getDay(), weekNav.children[hoje.getDay()]);
  renderFicha();
  mostrarInfoPersonalizado();
}

function dataDaSemana(offset) {
  const d = new Date(hoje);
  d.setDate(hoje.getDate() - hoje.getDay() + offset);
  return d;
}

function renderNav() {
  weekNav.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const d = dataDaSemana(i);
    const btn = document.createElement('button');
    btn.className = 'day-btn' + (i === hoje.getDay() ? ' active' : '');
    btn.innerHTML = `${dias[i].slice(0, 3)}${getFaltas().includes(i) ? ' ❌' : ''}<small>${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</small>`;
    btn.onclick = () => selecionar(i, btn);
    weekNav.appendChild(btn);
  }
}

function selecionar(i, btn) {
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  diaAtual = i;
  const d = dataDaSemana(i);
  const t = getPlanoEfetivo()[i];
  if (!t) {
    info.innerHTML = `<h2>${dias[i]}, ${d.toLocaleDateString('pt-BR')}</h2><p>Dia de descanso — recupere-se bem! 😴</p>`;
    grid.innerHTML = '<p class="rest">Nenhum treino hoje. Aproveite para alongar! 🧘</p>';
    return;
  }
  info.innerHTML = bannerTreinoHTML(t, `${dias[i]}, ${d.toLocaleDateString('pt-BR')}`);
  grid.innerHTML = t.exercicios.map((e, idx) => planoCardHTML(e, i, idx)).join('');
  const faltas = getFaltas();
  if (faltas.includes(i)) {
    info.innerHTML += `<p><span class="tag" style="background:#7f1d1d;color:#fff">❌ Faltou — treino remanejado para o próximo dia</span> <button class="btn btn-del" style="width:auto;padding:6px 14px" onclick="marcarFalta(${i})">↩️ Desfazer</button></p>`;
  } else {
    info.innerHTML += `<button class="btn btn-marcar" style="width:auto;padding:8px 16px" onclick="marcarFalta(${i})">⚠️ Faltou neste treino</button>`;
  }
}

function cardHTML(e, custom) {
  const del = (custom !== undefined && custom !== null) ? `<button class="btn btn-del" onclick="removerExercicio(${custom})">🗑 Remover</button>` : '';
  const feito = (custom !== undefined && custom !== null) ? `<button class="btn ${e.feito ? 'btn-feito' : 'btn-marcar'}" onclick="toggleFeito(${custom})">${e.feito ? '✓ Feito' : '○ Marcar como feito'}</button>` : '';
  return `
  <div class="card ${e.feito ? 'card-feito' : ''}">
    <img src="${e.img || imgExercicio(e)}" alt="${esc(e.nome)}" loading="lazy" onerror="this.onerror=null;this.src=${fallbackImg(e)}">
    <div class="card-body">
      <h3>${e.nome}</h3>
      <p>${e.grupo}</p>
      <div class="tags"><span class="tag">${e.series}</span><span class="tag">${e.grupo}</span>${e.feito ? '<span class="tag tag-feito">✓ Feito</span>' : ''}</div>
      <button class="btn" onclick="abrirVideo('${e.videoId || ''}', '${encodeURIComponent(e.nome)}')">▶ Vídeo do Exercício</button>
      ${feito}
      ${del}
    </div>
  </div>`;
}

function toggleVideo(btn, videoId, nomeEnc) {
  const div = btn.parentElement.querySelector('.video-inline');
  if (div.style.display === 'block') { div.style.display = 'none'; div.innerHTML = ''; return; }
  const src = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?origin=https://www.treinofacil.app`
    : `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(decodeURIComponent(nomeEnc))}&origin=https://www.treinofacil.app`;
  div.innerHTML = `<div class="video-wrap"><iframe src="${src}" allowfullscreen allow="autoplay; encrypted-media"></iframe></div>`;
  div.style.display = 'block';
}

function toggleFeito(idx) {
  const f = getFicha();
  f[idx].feito = !f[idx].feito;
  saveFicha(f);
  renderFicha();
}

// ===== Ficha personalizada =====
function getFicha() {
  const u = getUser();
  const f = JSON.parse(localStorage.getItem('ft_ficha_' + u.email) || '[]');
  f.forEach(e => {
    const c = catalogo.find(c => c.nome.toLowerCase() === (e.nome || '').toLowerCase());
    e.img = c ? c.img : imgExercicio(e);
  });
  return f;
}
function saveFicha(f) {
  const u = getUser();
  localStorage.setItem('ft_ficha_' + u.email, JSON.stringify(f));
}

// Catálogo de exercícios para o select
const catalogo = [];
Object.values(treinos).forEach(t => t.exercicios.forEach(e => {
  if (!catalogo.find(c => c.nome === e.nome)) catalogo.push(e);
}));

// Exercícios extras disponíveis apenas no catálogo da ficha
const extras = [
  { nome: 'Fly com Halteres', grupo: 'Peito', series: '3x12', videoId: 'WtXNFbd6C4M', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Mergulho no Banco', grupo: 'Tríceps', series: '3x12', videoId: 'p_DeBmkbCUc', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Barra Fixa', grupo: 'Costas', series: '4x8', videoId: 'QvGUdPHgEK4', img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Levantamento Terra', grupo: 'Costas', series: '4x8', videoId: 'oSaXuwqLpWc', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Afundo com Halteres', grupo: 'Pernas', series: '3x12', videoId: 'XKbZF4JR5Go', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Cadeira Flexora', grupo: 'Posterior', series: '3x12', videoId: 'MqhoP1kWMA8', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Hip Thrust', grupo: 'Glúteos', series: '4x12', videoId: '_i6qpcI1Nw4', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Desenvolvimento Militar', grupo: 'Ombros', series: '4x10', videoId: 'F1NZ3MoNCvU', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Remada Alta', grupo: 'Ombros', series: '3x12', videoId: '_g45I_aXF-Q', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Rosca Scott', grupo: 'Bíceps', series: '3x12', videoId: 'Drr7NpnjssA', img: 'https://images.unsplash.com/photo-1529366825943-3005b026d636?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Rosca Concentrada', grupo: 'Bíceps', series: '3x12', videoId: 'Qm4NdQttdi8', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Tríceps Francês', grupo: 'Tríceps', series: '3x12', videoId: '5uolmk0hgP0', img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Tríceps Coice', grupo: 'Tríceps', series: '3x12', videoId: 'JKrjAtGqkxU', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Abdominal Oblíquo', grupo: 'Abdominal', series: '4x15', videoId: 'wWtaDcMwU20', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Leg Raise', grupo: 'Abdominal', series: '4x12', videoId: 'Gw_3oAQyHXA', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=70' },
  { nome: 'Pular Corda', grupo: 'Cardio', series: '4x1min', videoId: '0bRV-Nz381Y', img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=600&q=70' },
];
extras.forEach(e => catalogo.push(e));

// Lista completa de exercícios por grupo muscular
const GRUPO_NORM = { 'Posterior de coxa': 'Posterior', 'Panturrilhas': 'Panturrilha', 'Abdômen': 'Abdominal' };
const VIDEO_EXTRAS = { "Supino reto com barra": "fG_03xSzT2s", "Supino inclinado com barra": "6jBx5YwAb7E", "Supino reto com halteres": "YiP-Zhk5YMk", "Supino inclinado com halteres": "Ky_JXqloq0w", "Crucifixo reto": "uDMmccuPVPQ", "Crucifixo inclinado": "3QnPv8TCaNk", "Crossover na polia": "poe7X02U2qw", "Peck deck (voador)": "MENdoLpyj7c", "Supino declinado": "iYPlm6rDDnY", "Puxada atrás": "4-PsgYmkDsM", "Puxada frontal na polia": "epbnBUzjJ2U", "Puxada frontal com pegada aberta": "epbnBUzjJ2U", "Puxada frontal com pegada fechada": "epbnBUzjJ2U", "Puxada supinada": "epbnBUzjJ2U", "Puxada unilateral": "epbnBUzjJ2U", "Puxada na máquina": "epbnBUzjJ2U", "Remada baixa na polia": "zw0lUIPCq-U", "Remada curvada com barra": "SbuXAFpDUkI", "Remada unilateral com halter": "SbuXAFpDUkI", "Remada cavalinho": "SbuXAFpDUkI", "Remada articulada na máquina": "14GcffFimi0", "Remada na máquina com apoio no peito": "14GcffFimi0", "Remada unilateral na máquina": "14GcffFimi0", "Remada baixa com triangulo": "zw0lUIPCq-U", "Remada baixa com barra": "zw0lUIPCq-U", "Remada unilateral na polia": "14GcffFimi0", "Pulldown na polia": "epbnBUzjJ2U", "Barra fixa pronada": "QvGUdPHgEK4", "Barra fixa supinada": "QvGUdPHgEK4", "Barra fixa com pegada neutra": "QvGUdPHgEK4", "Barra fixa assistida na máquina": "QvGUdPHgEK4", "Extensão lombar no banco": "", "Extensão lombar na máquina": "", "Remada articulada": "14GcffFimi0", "Pullover na polia": "3-HByhIzcgA", "Puxada neutra": "MzjQ92Lv9Xk", "Desenvolvimento com barra": "7WKZ3H3s2Qs", "Crucifixo inverso": "Z3hRQSnfcys", "Elevação lateral na polia": "08F4SWOlR38", "Face pull": "kamdxk0L4Yw", "Desenvolvimento na máquina": "uh0oZorifmM", "Desenvolvimento na máquina articulada": "uh0oZorifmM", "Face pull na polia": "kamdxk0L4Yw", "Crucifixo inverso com halteres": "Z3hRQSnfcys", "Crucifixo inverso na máquina": "Z3hRQSnfcys", "Crucifixo inverso na polia": "Z3hRQSnfcys", "Remada alta com barra": "_g45I_aXF-Q", "Remada alta na polia": "_g45I_aXF-Q", "Rosca direta com barra": "w2csAtnz9kA", "Rosca direta na barra W": "w2csAtnz9kA", "Rosca inversa com barra": "b57Wyr7c1Xk", "Rosca 21": "w2csAtnz9kA", "Rosca alternada": "LpM7dGNzMTo", "Rosca simultânea": "LpM7dGNzMTo", "Rosca martelo": "", "Rosca concentrada": "Qm4NdQttdi8", "Rosca Scott com halteres": "Drr7NpnjssA", "Rosca direta na polia": "M6CPOlx7n9g", "Rosca unilateral na polia": "M6CPOlx7n9g", "Rosca martelo na corda": "M6CPOlx7n9g", "Rosca Scott na polia": "Drr7NpnjssA", "Rosca inversa na polia": "b57Wyr7c1Xk", "Rosca Scott na máquina": "Drr7NpnjssA", "Rosca bíceps na máquina": "Drr7NpnjssA", "Rosca unilateral na máquina": "Drr7NpnjssA", "Rosca inclinada com halteres": "YZAnUESiH4Q", "Rosca spider": "Drr7NpnjssA", "Rosca Zottman": "LpM7dGNzMTo", "Rosca drag": "w2csAtnz9kA", "Rosca alternada com halteres": "LpM7dGNzMTo", "Rosca na polia": "M6CPOlx7n9g", "Rosca inversa": "b57Wyr7c1Xk", "Rosca no banco inclinado": "YZAnUESiH4Q", "Tríceps corda": "VnFopAIGO7E", "Tríceps unilateral na polia": "QBTnhqZdQLc", "Mergulho nas paralelas": "qyr4VaEhG3g", "Supino fechado": "FLHlhZ3gEvo", "Leg press 45°": "adPY6cd4h58", "Agachamento no Smith": "qcqSQrQCU3c", "Hack squat": "PRzZVKxpuhE", "Agachamento sumô": "9qwvgBHdml0", "Afundo": "nUlG__NTuxQ", "Passada com halteres": "nFWardGq1Uo", "Mesa flexora": "dMYsB4Eb2BY", "Stiff com barra": "N55yUjeWp4A", "Stiff com halteres": "BU_87JJzNA4", "Levantamento terra romeno": "dta3aMVe9qA", "Elevação pélvica": "lxtMK7KP4Qc", "Coice na polia": "ToE6yT5pHZ0", "Abdução de quadril na máquina": "S9OtoSJdMWo", "Glúteo no Smith": "qcqSQrQCU3c", "Abdução de quadril com elástico": "fBCqyN2sDwI", "Passada": "RP9U8JZKgiI", "Afundo búlgaro": "v-bItsW7fUI", "Panturrilha em pé": "EILF4iyBxSQ", "Panturrilha sentado": "ciTzpPbR2WY", "Panturrilha no leg press": "erUNxqpFxkc", "Panturrilha unilateral": "RmdlGKe2SD0", "Abdominal supra": "MKq4WH-eBAQ", "Abdominal infra": "p_pmF_6Jepc", "Abdominal bicicleta": "6s4cDQw1RwU", "Elevação de pernas": "NJoFF3O87Rs", "Abdominal na máquina": "D9nvaeELxb0", "Abdominal na polia": "zp6uK1aE1Lc", "Prancha lateral": "pWGhRO5grqs" };
const listaCompleta = {
  'Peito': ['Supino reto com barra','Supino inclinado com barra','Supino reto com halteres','Supino inclinado com halteres','Crucifixo reto','Crucifixo inclinado','Crossover na polia','Peck deck (voador)','Flexão de braço','Supino declinado'],
  'Costas': ['Puxada frontal na polia','Puxada frontal com pegada aberta','Puxada frontal com pegada fechada','Puxada supinada','Puxada unilateral','Puxada na máquina','Puxada atrás','Puxada neutra','Remada baixa na polia','Remada curvada com barra','Remada unilateral com halter','Remada cavalinho','Remada articulada na máquina','Remada na máquina com apoio no peito','Remada unilateral na máquina','Remada baixa com triangulo','Remada baixa com barra','Remada unilateral na polia','Pulldown na polia','Pullover na polia','Barra fixa pronada','Barra fixa supinada','Barra fixa com pegada neutra','Barra fixa assistida na máquina','Extensão lombar no banco','Extensão lombar na máquina','Levantamento terra'],

  'Ombros': ['Desenvolvimento com barra','Desenvolvimento com halteres','Desenvolvimento na máquina','Desenvolvimento na máquina articulada','Desenvolvimento Arnold','Elevação lateral com halteres','Elevação lateral na máquina','Elevação lateral na polia','Elevação lateral unilateral na polia','Elevação frontal com halteres','Elevação frontal com barra','Elevação frontal na polia','Elevação frontal na máquina','Crucifixo inverso com halteres','Crucifixo inverso na máquina','Crucifixo inverso na polia','Face pull na polia','Remada alta com barra','Remada alta na polia','Encolhimento com halteres ou barra'],
  'Bíceps': ['Rosca direta com barra','Rosca direta na barra W','Rosca inversa com barra','Rosca 21','Rosca alternada','Rosca simultânea','Rosca martelo','Rosca concentrada','Rosca Scott com halteres','Rosca direta na polia','Rosca unilateral na polia','Rosca martelo na corda','Rosca Scott na polia','Rosca inversa na polia','Rosca Scott na máquina','Rosca bíceps na máquina','Rosca unilateral na máquina','Rosca inclinada com halteres','Rosca spider','Rosca Zottman','Rosca drag'],
  'Tríceps': ['Tríceps pulley','Tríceps pulley com barra','Tríceps pulley com corda','Tríceps pulley unilateral','Tríceps pulley com pegada invertida','Tríceps corda','Tríceps testa','Tríceps testa com barra','Tríceps testa com halteres','Tríceps testa na máquina','Tríceps francês','Tríceps francês com halter','Tríceps francês na polia','Tríceps acima da cabeça com corda','Tríceps máquina sentado','Tríceps máquina articulada','Tríceps mergulho (dip) na máquina','Tríceps coice','Tríceps unilateral na polia','Paralelas (dips)','Mergulho nas paralelas','Supino fechado','Flexão fechada'],
  'Quadríceps': ['Agachamento livre','Leg press 45°','Cadeira extensora','Agachamento no Smith','Hack squat','Agachamento sumô','Afundo','Passada com halteres'],
  'Posterior de coxa': ['Mesa flexora','Cadeira flexora','Stiff com barra','Stiff com halteres','Levantamento terra romeno'],
  'Glúteos': ['Elevação pélvica','Coice na polia','Abdução de quadril na máquina','Agachamento sumô','Glúteo no Smith','Abdução de quadril com elástico','Passada','Afundo búlgaro'],
  'Panturrilhas': ['Panturrilha em pé','Panturrilha sentado','Panturrilha no leg press','Panturrilha unilateral'],
  'Abdômen': ['Abdominal supra','Abdominal infra','Abdominal bicicleta','Prancha abdominal','Elevação de pernas','Abdominal na máquina','Abdominal na polia','Prancha lateral','Abdominal oblíquo']
};
Object.entries(listaCompleta).forEach(([grupo, nomes]) => {
  nomes.forEach(nome => {
    if (!catalogo.find(c => c.nome.toLowerCase() === nome.toLowerCase())) {
      catalogo.push({ nome, grupo: GRUPO_NORM[grupo] || grupo, series: '3x12', videoId: VIDEO_EXTRAS[nome] || '', img: '' });
    }
  });
});

// Ilustrações SVG coloridas e exclusivas para cada exercício
const svgFrame = slug => 'https://bryllim.github.io/workout-guide/frames/' + slug + '/frame-1.svg';
const hashTexto = str => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

function gerarSvgExercicio(ex) {
  const nome = (ex && ex.nome) ? ex.nome : 'Exercício';
  const grupo = (ex && ex.grupo) ? ex.grupo : 'Força';
  const s = hashTexto(nome + '|' + grupo);
  const paleta = {
    Peito: ['#ff7a59', '#ffb067', '#f7f3ff'],
    Costas: ['#4ecdc4', '#2b6cb0', '#edf7ff'],
    Ombros: ['#ffa94d', '#ff5f6d', '#fff3d6'],
    Bíceps: ['#60d394', '#2d9cdb', '#f1fff4'],
    Tríceps: ['#7c4dff', '#ff5ea8', '#f4ecff'],
    Quadríceps: ['#4cc9f0', '#4361ee', '#edf9ff'],
    Pernas: ['#4cc9f0', '#4361ee', '#edf9ff'],
    Posterior: ['#5eead4', '#0ea5e9', '#ecfeff'],
    Glúteos: ['#fbbf24', '#f97316', '#fff7d6'],
    Panturrilha: ['#34d399', '#10b981', '#edfff8'],
    Abdominal: ['#7dd3fc', '#2563eb', '#eef8ff'],
    Cardio: ['#f87171', '#fb7185', '#fff1f2'],
    Funcional: ['#fbbf24', '#f59e0b', '#fff9e6'],
    default: ['#38bdf8', '#8b5cf6', '#f8fafc']
  }[grupo] || ['#38bdf8', '#8b5cf6', '#f8fafc'];

  const [c1, c2, c3] = paleta;
  const orbX = 70 + (s % 180);
  const orbY = 62 + ((s >> 3) % 80);
  const angle = (s % 30) + 15;
  const bar1 = 120 + (s % 130);
  const bar2 = 280 + ((s >> 2) % 140);
  const topAccent = 24 + (s % 80);

  const iconMap = {
    Peito: `<g><rect x="160" y="120" width="163" height="18" rx="9" fill="#1e293b" opacity="0.88"/><path d="M198 138 L225 84 L260 84 L288 138" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M185 205 L245 150 L312 205" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="200" cy="145" r="14" fill="#ffffff" opacity="0.9"/><circle cx="285" cy="145" r="14" fill="#ffffff" opacity="0.9"/></g>`,
    Costas: `<g><path d="M170 126 L205 85 L250 85 L286 126 L315 220 L170 220 Z" fill="#f8fafc" opacity="0.9"/><path d="M180 140 L202 118 L233 118 L250 142 L263 118 L294 118 L315 140" fill="none" stroke="#1e293b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M214 220 L224 185 L210 142 M284 220 L274 185 L286 142" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/><circle cx="199" cy="111" r="12" fill="#f8fafc"/><circle cx="282" cy="111" r="12" fill="#f8fafc"/></g>`,
    Ombros: `<g><path d="M182 132 L230 110 L270 110 L318 132 L295 220 L202 220 Z" fill="#fff7ed" opacity="0.92"/><path d="M180 132 L148 185 M320 132 L352 185" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/><path d="M175 168 L132 152 M325 168 L368 152" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/><circle cx="250" cy="86" r="22" fill="#fff7ed"/></g>`,
    Bíceps: `<g><path d="M180 205 L210 145 L246 145 L266 205" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M270 205 L295 145 L332 145 L312 205" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M215 142 L166 111 M310 142 L358 111" stroke="#1e293b" stroke-width="9" stroke-linecap="round"/><circle cx="248" cy="86" r="20" fill="#ffffff" opacity="0.9"/></g>`,
    Tríceps: `<g><rect x="170" y="110" width="200" height="22" rx="11" fill="#ffffff" opacity="0.9"/><path d="M232 132 L194 188 M286 132 L324 188" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/><path d="M208 202 L250 152 L292 202" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="250" cy="77" r="20" fill="#ffffff" opacity="0.88"/></g>`,
    Quadríceps: `<g><path d="M185 220 L210 145 L246 160 L268 220 Z" fill="#f8fafc" opacity="0.94"/><path d="M290 220 L315 145 L350 165 L330 220 Z" fill="#f8fafc" opacity="0.94"/><path d="M202 112 L225 82 L260 82 L280 112 L250 140 L205 140 Z" fill="#ffffff" opacity="0.92"/><path d="M205 140 L180 220 M295 140 L322 220" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/></g>`,
    Pernas: `<g><path d="M185 220 L210 145 L246 160 L268 220 Z" fill="#f8fafc" opacity="0.94"/><path d="M290 220 L315 145 L350 165 L330 220 Z" fill="#f8fafc" opacity="0.94"/><path d="M202 112 L225 82 L260 82 L280 112 L250 140 L205 140 Z" fill="#ffffff" opacity="0.92"/><path d="M205 140 L160 220 M295 140 L340 220" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/></g>`,
    Posterior: `<g><path d="M182 210 L221 140 L260 130 L304 210 Z" fill="#f8fafc" opacity="0.94"/><path d="M162 126 L195 90 L240 88 L268 118 L214 145 Z" fill="#fff" opacity="0.92"/><path d="M285 210 L320 160 L340 121 L370 138 L348 210 Z" fill="#f8fafc" opacity="0.94"/><path d="M215 146 L170 220 M300 146 L350 220" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/></g>`,
    Glúteos: `<g><path d="M185 202 L210 146 L248 135 L290 145 L323 202 Z" fill="#fff7ed" opacity="0.95"/><path d="M214 128 L242 92 L276 92 L304 128" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M190 155 L146 220 M318 155 L362 220" stroke="#1e293b" stroke-width="10" stroke-linecap="round"/></g>`,
    Panturrilha: `<g><path d="M165 190 L242 145 L305 145 L350 190" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M188 209 L160 236 M280 209 L318 236" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/><path d="M232 127 L250 96 L275 96 L295 127" fill="#ffffff" opacity="0.92"/></g>`,
    Abdominal: `<g><path d="M170 200 L254 116 L334 200" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M206 220 L256 158 L304 220" fill="none" stroke="#ffffff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M150 192 L120 227 M350 192 L380 227" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/><circle cx="252" cy="80" r="18" fill="#ffffff" opacity="0.9"/></g>`,
    Cardio: `<g><path d="M170 198 L220 142 L280 182 L325 120" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="230" cy="100" r="18" fill="#ffffff" opacity="0.92"/><circle cx="320" cy="120" r="16" fill="#ffffff" opacity="0.86"/><path d="M164 228 L366 228" stroke="#1e293b" stroke-width="10" stroke-linecap="round" opacity="0.6"/></g>`,
    Funcional: `<g><path d="M176 214 L216 150 L256 170 L298 126 L334 214" fill="none" stroke="#ffffff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M140 210 L170 210 M332 210 L366 210" stroke="#1e293b" stroke-width="9" stroke-linecap="round"/><circle cx="256" cy="88" r="20" fill="#ffffff" opacity="0.9"/></g>`
  };

  const silhouette = iconMap[grupo] || iconMap.default || iconMap.Peito;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 320'>
      <defs>
        <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${c1}'/>
          <stop offset='100%' stop-color='${c2}'/>
        </linearGradient>
        <radialGradient id='glow' cx='50%' cy='32%' r='56%'>
          <stop offset='0%' stop-color='${c3}' stop-opacity='0.9'/>
          <stop offset='100%' stop-color='${c3}' stop-opacity='0'/>
        </radialGradient>
      </defs>
      <rect width='600' height='320' rx='26' fill='url(#bg)'/>
      <circle cx='${orbX}' cy='${orbY}' r='68' fill='url(#glow)'/>
      <circle cx='${orbX + 180}' cy='${orbY - 14}' r='42' fill='rgba(255,255,255,0.18)'/>
      <path d='M0 255 Q 130 232 270 248 T600 242 L600 320 L0 320 Z' fill='rgba(15,23,42,0.18)'/>
      <path d='M90 ${topAccent} L220 ${topAccent} M370 ${topAccent} L510 ${topAccent}' stroke='rgba(255,255,255,0.62)' stroke-width='8' stroke-linecap='round' stroke-dasharray='8 12'/>
      <g transform='rotate(${angle} 300 150)'>
        <rect x='${bar1}' y='66' width='180' height='10' rx='5' fill='rgba(15,23,42,0.7)'/> 
        <rect x='${bar2}' y='64' width='92' height='12' rx='6' fill='rgba(15,23,42,0.7)'/>
      </g>
      ${silhouette}
      <path d='M146 278 L450 278' stroke='rgba(15,23,42,0.6)' stroke-width='12' stroke-linecap='round'/>
      <circle cx='148' cy='72' r='8' fill='rgba(255,255,255,0.85)'/>
      <circle cx='465' cy='88' r='10' fill='rgba(255,255,255,0.8)'/>
    </svg>
  `;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

const imgExercicio = e => {
  const key = ((e && e.nome) || '').toLowerCase().trim();
  if (typeof IMG_REAL !== 'undefined' && IMG_REAL[key]) return IMG_REAL[key];
  const ILL = (typeof window !== 'undefined') && window.TreinoFacilIlus;
  if (ILL && ILL.dataUri) return ILL.dataUri(e || { nome: 'Exercício', grupo: 'default' });
  return gerarSvgExercicio(e);
};

Object.values(treinos).forEach(t => {
  t.exercicios.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  t.exercicios.forEach(ex => { ex.img = imgExercicio(ex); });
});
extras.forEach(ex => { ex.img = imgExercicio(ex); });
catalogo.forEach(e => { e.img = imgExercicio(e); });
catalogo.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));


const SUBGRUPOS_PERNAS = ['Pernas', 'Quadríceps', 'Posterior', 'Glúteos', 'Panturrilha'];
const NOME_SUB = { 'Posterior': 'Posterior de coxa', 'Panturrilha': 'Panturrilhas', 'Pernas': 'Geral' };

function popularSelect() {
  const sel = $('fxGrupoSel');
  sel.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
  const ordem = ['Peito','Tríceps','Costas','Bíceps','Ombros','Membros Inferiores','Abdominal','Cardio','Funcional'];
  ordem.forEach(g => {
    const existe = g === 'Membros Inferiores'
      ? catalogo.some(e => SUBGRUPOS_PERNAS.includes(e.grupo))
      : catalogo.some(e => e.grupo === g);
    if (!existe) return;
    const o = document.createElement('option');
    o.value = g;
    o.textContent = g;
    sel.appendChild(o);
  });
}

function filtrarExercicios() {
  const grupo = $('fxGrupoSel').value;
  const lista = $('fxExercicioList');
  lista.innerHTML = '';
  $('exSelecionados').innerHTML = '';
  if (!grupo) {
    lista.innerHTML = '<p class="rest">— 2. Selecione o grupo para ver os exercícios —</p>';
    return;
  }
  const itensDoGrupo = (filtro) => catalogo.map((e, i) => ({ e, i })).filter(({ e }) => filtro(e.grupo));
  if (grupo === 'Membros Inferiores') {
    SUBGRUPOS_PERNAS.forEach(sub => {
      const itens = itensDoGrupo(g => g === sub);
      if (!itens.length) return;
      const h = document.createElement('h4');
      h.textContent = NOME_SUB[sub] || sub;
      h.style.cssText = 'color:#9ef01a;margin:10px 0 4px';
      lista.appendChild(h);
      itens.forEach(({ e, i }) => lista.appendChild(criarCheckExercicio(i, e.nome)));
    });
    return;
  }
  itensDoGrupo(g => g === grupo).forEach(({ e, i }) => lista.appendChild(criarCheckExercicio(i, e.nome)));
}

function criarCheckExercicio(i, nome) {
  const label = document.createElement('label');
  label.className = 'ex-check';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.value = i;
  cb.onchange = atualizarSelecionados;
  label.appendChild(cb);
  const thumb = document.createElement('img');
  thumb.className = 'ex-thumb';
  thumb.alt = nome;
  thumb.loading = 'lazy';
  thumb.src = imgExercicio(catalogo[i] || { nome, grupo: '' });
  label.appendChild(thumb);
  label.appendChild(document.createTextNode(' ' + nome));
  return label;
}

function atualizarSelecionados() {
  const marcados = [...document.querySelectorAll('#fxExercicioList input:checked')].map(c => c.value);
  const digitado = {};
  document.querySelectorAll('#exSelecionados .ex-row').forEach(r => {
    digitado[r.dataset.idx] = r.querySelector('.ex-series').value;
  });
  const box = $('exSelecionados');
  box.innerHTML = '';
  marcados.forEach(i => {
    const e = catalogo[i];
    const row = document.createElement('div');
    row.className = 'ex-row';
    row.dataset.idx = i;
    const nome = document.createElement('input');
    nome.className = 'ex-nome';
    nome.value = e.nome;
    nome.readOnly = true;
    const series = document.createElement('input');
    series.className = 'ex-series';
    series.placeholder = 'Séries x Reps (ex: 4x12)';
    series.value = digitado[i] !== undefined ? digitado[i] : (e.series || '');
    const thumb = document.createElement('img');
    thumb.className = 'ex-thumb';
    thumb.alt = e.nome;
    thumb.loading = 'lazy';
    thumb.src = imgExercicio(e);
    row.appendChild(thumb);
    row.appendChild(nome);
    row.appendChild(series);
    box.appendChild(row);
  });
}

function verificarDia() {
  const dia = parseInt($('fxDia').value);
  const existente = getFicha().find(e => e.dia === dia);
  const treinoInput = $('fxTreino');
  if (existente) {
    treinoInput.value = existente.nomeTreino || '';
    treinoInput.disabled = true;
    $('fxTreinoInfo').textContent = '📌 Treino salvo: "' + (existente.nomeTreino || '') + '"';
  } else {
    treinoInput.value = '';
    treinoInput.disabled = false;
    $('fxTreinoInfo').textContent = '';
  }
}

function adicionarExercicio() {
  const rows = document.querySelectorAll('#exSelecionados .ex-row');
  const dia = parseInt($('fxDia').value);
  const nomeTreino = $('fxTreino').value.trim();
  if (!rows.length) return alert('Selecione pelo menos um exercício.');
  if (!nomeTreino) return alert('Digite um nome para o treino do dia.');
  for (const r of rows) {
    if (!r.querySelector('.ex-series').value.trim()) {
      return alert('Informe as séries x reps de todos os exercícios selecionados.');
    }
  }
  const f = getFicha();
  rows.forEach(r => {
    const e = catalogo[r.dataset.idx];
    const series = r.querySelector('.ex-series').value.trim();
    f.push({
      nome: e.nome,
      grupo: e.grupo || 'Geral',
      series,
      dia,
      nomeTreino,
      videoId: e.videoId || '',
      img: '', // o desenho é gerado na hora (não pesa no armazenamento)
    });
  });
  saveFicha(f);
  $('fxTreino').disabled = true; // mantém o nome após salvar o treino do dia
  $('fxExercicioList').innerHTML = '<p class="rest">— 2. Selecione o grupo para ver os exercícios —</p>';
  $('fxGrupoSel').value = '';
  $('exSelecionados').innerHTML = '';
  renderFicha();
}

function removerExercicio(idx) {
  const f = getFicha();
  f.splice(idx, 1);
  saveFicha(f);
  renderFicha();
  verificarDia();
}

function renderFicha() {
  const f = getFicha();
  const el = $('fichaList');
  if (!f.length) { el.innerHTML = '<p class="rest">Sua ficha está vazia. Adicione exercícios acima! 💪</p>'; return; }
  const porDia = {};
  f.forEach((e, i) => { (porDia[e.dia] = porDia[e.dia] || []).push({ e, i }); });
  el.innerHTML = Object.keys(porDia).sort().map(dia => {
    const itens = porDia[dia];
    const nomeTreino = itens[0].e.nomeTreino || 'Treino do dia';
    const treino = {
      nome: `${dias[dia]} — ${nomeTreino}`,
      descricao: 'Ficha personalizada • montada por você',
      exercicios: itens.map(x => x.e)
    };
    return bannerTreinoHTML(treino) +
      '<div class="grid">' + itens.map(({ e, i }) => cardHTML(e, i)).join('') + '</div>';
  }).join('');
}

// ===== Ficha personalizada (Plano Semanal) =====
const AGENDA = { 2: [1, 4], 3: [1, 3, 5], 4: [1, 2, 4, 5], 5: [1, 2, 3, 4, 6], 6: [1, 2, 3, 4, 5, 6], 7: [0, 1, 2, 3, 4, 5, 6] };
const TIPOS = [
  { k: 1, n: 'Treino A', g: 'Peito e Tríceps', base: () => treinos[1] },
  { k: 2, n: 'Treino B', g: 'Costas e Bíceps', base: () => treinos[2] },
  { k: 4, n: 'Treino C', g: 'Pernas', base: () => treinos[4] },
  { k: 5, n: 'Treino D', g: 'Ombros e Abdômen', base: () => treinos[5] },
  { k: 6, n: 'Full Body', g: 'Corpo Inteiro / Cardio', base: () => treinos[6] },
];
const SCHEMAS = { ab: [0, 1], abc: [0, 1, 2], abcd: [0, 1, 2, 3], full: [4] };
const NOME_DIVISAO = { ab: 'Treino A/B', abc: 'Treino ABC', abcd: 'Treino ABCD', full: 'Corpo inteiro (Full Body)' };

function getPlanoCustom() {
  const u = getUser(); if (!u) return null;
  const c = JSON.parse(localStorage.getItem('ft_plano_' + u.email) || 'null');
  if (!c) return null;
  Object.values(c.treinos || {}).forEach(t => (t.exercicios || []).forEach(e => {
    const cat = catalogo.find(x => x.nome.toLowerCase() === (e.nome || '').toLowerCase());
    e.img = cat ? cat.img : imgExercicio(e);
  }));
  return c;
}
function getPlano() { const c = getPlanoCustom(); return c ? c.treinos : treinos; }

// ===== Faltas: remaneja o treino do dia que faltou para o próximo dia =====
function getFaltas() {
  const u = getUser(); if (!u) return [];
  return JSON.parse(localStorage.getItem('ft_faltas_' + u.email) || '[]');
}
function saveFaltas(f) {
  const u = getUser();
  localStorage.setItem('ft_faltas_' + u.email, JSON.stringify(f));
}
function getPlanoEfetivo() {
  const raw = getPlano();
  const faltas = getFaltas();
  if (!faltas.length) return raw;
  const eff = {};
  Object.keys(raw).forEach(k => { eff[k] = raw[k]; });
  faltas.map(Number).sort((a, b) => a - b).forEach(D => {
    if (!eff[D]) return;
    let N = null;
    for (let j = D + 1; j < 7; j++) { if (eff[j]) { N = j; break; } }
    if (N === null) return;
    const tmp = eff[D]; eff[D] = eff[N]; eff[N] = tmp;
  });
  return eff;
}
function marcarFalta(i) {
  const f = getFaltas();
  const k = f.indexOf(i);
  if (k >= 0) f.splice(k, 1); else f.push(i);
  saveFaltas(f);
  renderNav();
  selecionar(diaAtual, weekNav.children[diaAtual]);
}

function seriesPara(objetivo, nivel, idade, lesao) {
  let sets, reps;
  if (objetivo === 'Ganhar força') { sets = 4; reps = '6-8'; }
  else if (objetivo === 'Melhorar resistência') { sets = 3; reps = '15-20'; }
  else if (objetivo === 'Condicionamento físico e saúde') { sets = 3; reps = '12'; }
  else { sets = 4; reps = '10-12'; }
  if (nivel === 'Iniciante') sets -= 1;
  if (nivel === 'Avançado') sets += 1;
  if (idade >= 55) sets -= 1;
  if (lesao) sets -= 1;
  sets = Math.max(2, Math.min(5, sets));
  if (lesao && reps === '6-8') reps = '10';
  return `${sets}x${reps}`;
}

function toggleLesaoSub() {
  $('lesaoSub').style.display = $('qLesao').value === 'Sim' ? 'block' : 'none';
}

const LESAO_GRUPOS = {
  'Tornozelo': ['Panturrilha', 'Cardio'],
  'Joelho': ['Quadríceps', 'Posterior', 'Glúteos'],
  'Quadril': ['Glúteos', 'Posterior'],
  'Lombar': ['Costas', 'Abdominal'],
  'Ombro': ['Ombros'],
  'Cotovelo': ['Bíceps', 'Tríceps'],
  'Punho/Mão': ['Abdominal'],
  'Pescoço': ['Ombros', 'Abdominal']
};

async function gerarFichaPersonalizada() {
  const idade = parseInt($('qIdade').value);
  const peso = parseFloat($('qPeso').value);
  const altura = parseFloat($('qAltura').value);
  const nivel = $('qNivel').value;
  const objetivo = $('qObjetivo').value;
  const diasSem = parseInt($('qDias').value);
  const tempo = parseInt($('qTempo').value);
  const hasLesao = $('qLesao').value;
  let divisao = $('qDivisao').value;
  if (!idade || idade < 10 || idade > 90 || !nivel || !objetivo || !diasSem || !tempo || !hasLesao || !peso || peso < 30 || peso > 300 || !altura || altura < 100 || altura > 250)
    return alert('Responda todas as perguntas para montar sua ficha (incluindo peso e altura).');

  const u = getUser();
  const payloadBase = {
    nome: (u && u.nome) ? u.nome : 'Aluno',
    email: (u && u.email) ? u.email : 'aluno@treinofacil.app',
    idade,
    peso,
    altura,
    nivel,
    objetivo,
    diasSem,
    tempo,
    divisao,
    lesao: hasLesao === 'Sim',
    areas: hasLesao === 'Sim' ? [...document.querySelectorAll('#lesaoSub input:checked')].map(c => c.value) : [],
    genero: 'não informado'
  };

  const iaPlan = await gerarFichaComIA(payloadBase);
  if (iaPlan && iaPlan.treinos) {
    const plano = {
      divisao: iaPlan.divisao || (payloadBase.divisao === 'auto' ? 'abc' : payloadBase.divisao),
      diasSem,
      objetivo,
      nivel,
      idade,
      tempo,
      lesao: payloadBase.lesao,
      areas: payloadBase.areas,
      peso,
      altura,
      imc: +(peso / Math.pow(altura / 100, 2)).toFixed(1),
      treinos: iaPlan.treinos
    };
    localStorage.setItem('ft_plano_' + u.email, JSON.stringify(plano));
    mostrarInfoPersonalizado();
    renderNav();
    selecionar(hoje.getDay(), weekNav.children[hoje.getDay()]);
    alert('Sua ficha personalizada foi criada pela IA! 💪');
    return;
  }

  const imc = +(peso / Math.pow(altura / 100, 2)).toFixed(1);
  const imcTxt = imc < 18.5 ? 'abaixo do peso' : imc < 25 ? 'peso normal' : imc < 30 ? 'sobrepeso' : 'obesidade';
  const lesao = hasLesao === 'Sim';
  const areas = lesao ? [...document.querySelectorAll('#lesaoSub input:checked')].map(c => c.value) : [];
  const gruposEvitar = new Set(areas.flatMap(a => LESAO_GRUPOS[a] || []));
  const okComLesao = e => !gruposEvitar.has(e.grupo);
  if (divisao === 'auto') divisao = diasSem === 2 ? 'full' : diasSem === 3 ? 'abc' : diasSem === 4 ? 'abcd' : diasSem === 5 ? 'abcd' : diasSem === 7 ? 'abcd' : 'abc';
  const agenda = AGENDA[diasSem];
  const seq = SCHEMAS[divisao];
  const series = seriesPara(objetivo, nivel, idade, lesao);
  const nEx = tempo <= 30 ? 4 : tempo <= 45 ? 5 : tempo <= 60 ? 6 : 7;
  const personalizado = {};
  agenda.forEach((dia, i) => {
    const tipo = TIPOS[seq[i % seq.length]];
    const base = tipo.base();
    const grupos = [...new Set(base.exercicios.map(e => e.grupo))].filter(g => !gruposEvitar.has(g));
    if (tipo.k === 4 && !gruposEvitar.has('Glúteos')) grupos.push('Glúteos');
    const usados = new Set(base.exercicios.map(e => e.nome.toLowerCase()));
    const pad = catalogo.filter(c => c.nome && !usados.has(c.nome.toLowerCase()) && grupos.includes(c.grupo) && !gruposEvitar.has(c.grupo));
    let exs = base.exercicios.filter(okComLesao).slice(0, nEx).map(e => ({ ...e, series }));
    for (let j = 0; j < pad.length && exs.length < nEx; j++)
      exs.push({ nome: pad[j].nome, series, grupo: pad[j].grupo, img: '', videoId: pad[j].videoId });
    if (!exs.length) {
      const reserva = catalogo.filter(c => !gruposEvitar.has(c.grupo) && !usados.has(c.nome.toLowerCase()));
      for (let j = 0; j < reserva.length && exs.length < nEx; j++)
        exs.push({ nome: reserva[j].nome, series, grupo: reserva[j].grupo, img: '', videoId: reserva[j].videoId });
    }
    personalizado[dia] = {
      nome: tipo.k === 6 ? 'Full Body / Cardio' : `${tipo.n} — ${tipo.g}`,
      descricao: `${objetivo} • ${nivel} • ${tempo} min • IMC ${imc} (${imcTxt})${lesao ? ` • ajuste para restrição${areas.length ? ' em: ' + areas.join(', ') : ''}` : ''}`,
      exercicios: exs
    };
  });
  localStorage.setItem('ft_plano_' + u.email, JSON.stringify({ divisao, diasSem, objetivo, nivel, idade, tempo, lesao, areas, peso, altura, imc, treinos: personalizado }));
  mostrarInfoPersonalizado();
  renderNav();
  selecionar(hoje.getDay(), weekNav.children[hoje.getDay()]);
  alert('Sua ficha personalizada foi criada! 💪');
}

function mostrarInfoPersonalizado() {
  const c = getPlanoCustom();
  if (!c) { $('quizBox').style.display = 'block'; $('planoCustomInfo').style.display = 'none'; return; }
  $('quizBox').style.display = 'none';
  $('planoCustomInfo').style.display = 'block';
  $('planoCustomInfo').innerHTML = `
    <div class="plano-custom">
      <h2>🎯 Sua ficha personalizada</h2>
      <p>${NOME_DIVISAO[c.divisao]} • ${c.diasSem}x por semana • ${c.tempo} min/treino • ${c.objetivo} • ${c.nivel}${c.peso ? ` • ⚖️ ${c.peso}kg / ${c.altura}cm (IMC ${c.imc})` : ''}${c.lesao ? ' • ⚠️ Ajustada para restrição' + (c.areas && c.areas.length ? ' em: ' + c.areas.join(', ') : '') : ''}</p>
      <button class="btn" style="width:auto;padding:8px 20px" onclick="recriarFicha()">♻️ Criar nova ficha</button>
      <button class="btn btn-del" style="width:auto;padding:8px 20px" onclick="restaurarPlanoPadrao()">⟲ Restaurar plano padrão</button>
    </div>`;
}

function recriarFicha() { $('quizBox').style.display = 'block'; $('planoCustomInfo').style.display = 'none'; }
function restaurarPlanoPadrao() {
  const u = getUser();
  localStorage.removeItem('ft_plano_' + u.email);
  mostrarInfoPersonalizado();
  renderNav();
  selecionar(hoje.getDay(), weekNav.children[hoje.getDay()]);
}

// ===== Vídeo =====
function abrirVideo(videoId, nomeEnc) {
  const nome = decodeURIComponent(nomeEnc);
  // Abre direto no YouTube (no app ou navegador) — o embed do WebView é bloqueado pelo YouTube (erro 153)
  const url = videoId
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(nome + ' como fazer')}`;
  if (window.__ANDROID__) {
    // App Android: o WebView intercepta e abre direto no app do YouTube
    window.location.href = url;
  } else {
    // Navegador: abre em uma nova aba
    window.open(url, '_blank');
  }
}

$('closeModal').onclick = () => { modal.classList.remove('open'); videoFrame.src = ''; };
modal.onclick = ev => { if (ev.target === modal) { modal.classList.remove('open'); videoFrame.src = ''; } };

function trocarAba(aba) {
  $('abaPlano').style.display = aba === 'plano' ? 'block' : 'none';
  $('abaFicha').style.display = aba === 'ficha' ? 'block' : 'none';
  $('tabPlano').classList.toggle('active', aba === 'plano');
  $('tabFicha').classList.toggle('active', aba === 'ficha');
}

// init
popularSelect();
if (getUser()) iniciarApp(); else toggleAuth('login');
