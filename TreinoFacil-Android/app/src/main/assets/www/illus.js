/* ==========================================================================
   illus.js — TreinoFácil Fit
   Ilustrações coloridas, desenhadas individualmente para cada exercício.

   O que este arquivo faz:
   - Desenha um personagem em estilo cartoon realista (proporções humanas,
     volume nos músculos, sombra, roupa, tênis, cabelo e rosto).
   - Cada exercício tem sua própria POSE (posição das articulações) e seu
     próprio EQUIPAMENTO (banco, barra, halteres, polia, máquina, elástico,
     corda, tapete, paralelas...).
   - O SVG é montado em tempo real e embutido como data URI, portanto
     funciona 100% offline — inclusive dentro do APK Android.
   ========================================================================== */
(function (global) {
  'use strict';

  var W = 600, H = 320, CHAO = 274;

  /* --------------------------------------------------------------------
     CORES
     -------------------------------------------------------------------- */
  var FUNDO = {
    Peito:       ['#ff9a6b', '#f0435f'],
    Tríceps:     ['#a06bff', '#5b21b6'],
    Costas:      ['#22c1e0', '#0369a1'],
    Ombros:      ['#ffc14d', '#ea580c'],
    Bíceps:      ['#5fd6a0', '#127a52'],
    Quadríceps:  ['#5cc8ff', '#3b4fd8'],
    Pernas:      ['#5cc8ff', '#3b4fd8'],
    Posterior:   ['#6ee7d8', '#0e8fb8'],
    Glúteos:     ['#ffd166', '#f97316'],
    Panturrilha: ['#4ade9f', '#047857'],
    Core:        ['#8ecbff', '#1d4ed8'],
    Cardio:      ['#ff8fa3', '#be123c'],
    Funcional:   ['#ffe066', '#eab308'],
    default:     ['#5ab6f5', '#6d28d9']
  };

  var ROUPAS = ['#ff4d4d', '#ffc93c', '#7bc043', '#2f80ed', '#8e5cf7',
                '#ff8c42', '#2dd4a7', '#ec4899', '#22b8cf', '#f97316'];
  var PELES  = ['#fbd2b0', '#f2bd93', '#e0a878', '#c98a5f', '#9c6440'];
  var CABELOS = ['#241a12', '#4a3122', '#7b4a25', '#c98b3c', '#1f2937', '#8a5a2b'];
  var TENIS_COR = ['#f8fafc', '#1e293b', '#fbbf24', '#ef4444', '#22d3ee'];

  /* --------------------------------------------------------------------
     UTILIDADES DE COR
     -------------------------------------------------------------------- */
  function hexRGB(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbHex(r, g, b) {
    return '#' + [r, g, b].map(function (v) {
      return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2);
    }).join('');
  }
  /** Clareia (t>0) ou escurece (t<0) a cor. */
  function tom(hex, t) {
    var c = hexRGB(hex);
    if (t >= 0) return rgbHex(c[0] + (255 - c[0]) * t, c[1] + (255 - c[1]) * t, c[2] + (255 - c[2]) * t);
    var k = 1 + t;
    return rgbHex(c[0] * k, c[1] * k, c[2] * k);
  }
  function r1(n) { return Math.round(n * 10) / 10; }

  function hash(str) {
    var h = 2166136261, i;
    for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function escolher(lista, s, extra) {
    var i = ((s | 0) + (extra || 0)) % lista.length;
    if (i < 0) i += lista.length;
    return lista[i];
  }

  function ang(a, b) { return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; }

  /** Normaliza nome: minúsculo e sem acento, para achar a pose na tabela. */
  function chave(txt) {
    return String(txt == null ? '' : txt).toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
  }

  /* --------------------------------------------------------------------
     PRIMITIVAS DE DESENHO — capsula com espessuras diferentes nas pontas.
     É essa forma que dá "volume" ao corpo inteiro.
     -------------------------------------------------------------------- */
  function capsula(a, b, w1, w2, cor) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var L = Math.hypot(dx, dy);
    if (L < 0.5) return '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="' + r1(w1 / 2) + '" fill="' + cor + '"/>';
    var ux = dx / L, uy = dy / L, px = -uy, py = ux;
    var ra = w1 / 2, rb = w2 / 2;
    var x1 = a[0] + px * ra, y1 = a[1] + py * ra;
    var x2 = b[0] + px * rb, y2 = b[1] + py * rb;
    var x3 = b[0] - px * rb, y3 = b[1] - py * rb;
    var x4 = a[0] - px * ra, y4 = a[1] - py * ra;
    return '<path d="M' + r1(x1) + ' ' + r1(y1) +
           ' L' + r1(x2) + ' ' + r1(y2) +
           ' A' + r1(rb) + ' ' + r1(rb) + ' 0 0 1 ' + r1(x3) + ' ' + r1(y3) +
           ' L' + r1(x4) + ' ' + r1(y4) +
           ' A' + r1(ra) + ' ' + r1(ra) + ' 0 0 1 ' + r1(x1) + ' ' + r1(y1) + 'Z" fill="' + cor + '"/>';
  }

  /** Cápsula com sombra embaixo/direita e brilho em cima/esquerda (luz vindo do alto). */
  function volume(a, b, w1, w2, cor) {
    return capsula([a[0] + 2.4, a[1] + 2.6], [b[0] + 2.4, b[1] + 2.6], w1 * .96, w2 * .96, tom(cor, -.22)) +
      capsula(a, b, w1, w2, cor) +
      '<path d="' + brilho(a, b, w1, w2) + '" fill="' + tom(cor, .34) + '" opacity=".55"/>';
  }

  function brilho(a, b, w1, w2) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var L = Math.hypot(dx, dy) || 1;
    var ux = dx / L, uy = dy / L, px = -uy, py = ux;
    var oa = 0, ob = 0;
    var a1 = [a[0] - 1.6, a[1] - 2.2], b1 = [b[0] - 1.6, b[1] - 2.2];
    var ra = w1 * .26, rb = w2 * .26;
    var x1 = a1[0] + px * ra, y1 = a1[1] + py * ra;
    var x2 = b1[0] + px * rb, y2 = b1[1] + py * rb;
    var x3 = b1[0] - px * rb, y3 = b1[1] - py * rb;
    var x4 = a1[0] - px * ra, y4 = a1[1] - py * ra;
    return 'M' + r1(x1) + ' ' + r1(y1) + 'L' + r1(x2) + ' ' + r1(y2) +
           'A' + r1(rb) + ' ' + r1(rb) + ' 0 0 1 ' + r1(x3) + ' ' + r1(y3) +
           'L' + r1(x4) + ' ' + r1(y4) + 'A' + r1(ra) + ' ' + r1(ra) + ' 0 0 1 ' + r1(x1) + ' ' + r1(y1) + 'Z';
  }

  /** Interpolação linear entre dois pontos. */
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }

  /* --------------------------------------------------------------------
     CABEÇA —比例ções humanas, rosto e cabelo
     -------------------------------------------------------------------- */
  function cabeca(h, o) {
    var m = cabecaBase(h[0], h[1], o);
    var r = o.rot || 0;
    if (!r) return m;
    return '<g transform="rotate(' + r1(r) + ' ' + r1(h[0]) + ' ' + r1(h[1]) + ')">' + m + '</g>';
  }

  function cabecaBase(x, y, o) {
    var d = o.dir, pele = o.pele, cab = o.cabelo;
    var rx = 17, ry = 19.5;
    var out = '';

    // crânio + sombra do rosto
    out += '<ellipse cx="' + r1(x + 1.5) + '" cy="' + r1(y + 1.5) + '" rx="' + rx + '" ry="' + ry + '" fill="' + tom(pele, -.22) + '"/>';
    out += '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + rx + '" ry="' + ry + '" fill="' + pele + '"/>';
    // brilho na testa
    out += '<ellipse cx="' + r1(x - 4.5) + '" cy="' + r1(y - 6.5) + '" rx="6.5" ry="5" fill="' + tom(pele, .3) + '" opacity=".65"/>';

    // orelha
    out += '<ellipse cx="' + r1(x - d * rx * .92) + '" cy="' + r1(y + 2) + '" rx="4.2" ry="5.6" fill="' + tom(pele, -.1) + '"/>';
    // nariz
    if (o.view !== 'back') {
      out += '<path d="M' + r1(x + d * rx * .78) + ' ' + r1(y - 1) +
             ' q' + r1(d * 5) + ' ' + r1(3.5) + ' ' + r1(d * 1.5) + ' ' + r1(6) +
             '" stroke="' + tom(pele, -.34) + '" stroke-width="2" fill="none" stroke-linecap="round"/>';
    }

    if (o.view !== 'back') {
      // sobrancelhas
      out += '<path d="M' + r1(x + d * 2) + ' ' + r1(y - 6.4) + ' q' + r1(d * 4.4) + ' -2.4 ' + r1(d * 8.4) + ' .3" stroke="' + tom(cab, -.1) +
             '" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      // olho
      out += '<ellipse cx="' + r1(x + d * 6.4) + '" cy="' + r1(y - 1.6) + '" rx="3.3" ry="3.7" fill="#ffffff"/>';
      out += '<circle cx="' + r1(x + d * 7) + '" cy="' + r1(y - 1.2) + '" r="1.9" fill="#2b2118"/>';
      // boca (sorriso determinedo pelo esforço)
      out += '<path d="M' + r1(x + d * 2.2) + ' ' + r1(y + 7.4) +
             ' q' + r1(d * 5) + ' ' + (o.forca ? 4.2 : 5.4) + ' ' + r1(d * 9.6) + ' ' + (o.forca ? -.6 : 0) +
             '" stroke="#8a4b3a" stroke-width="2.3" fill="none" stroke-linecap="round"/>';
    }

    // cabelo
    out += cabelo(x, y, rx, ry, d, cab, o.tipo);
    return out;
  }

  function cabelo(x, y, rx, ry, d, cor, tipo) {
    var out = '<path d="M' + r1(x - rx - 1) + ' ' + r1(y - 1) +
      ' a' + (rx + 1) + ' ' + (ry + 1) + ' 0 0 1 ' + r1((rx + 1) * 2) + ' 0' +
      ' q' + r1(-d * 4) + ' -7 ' + r1(-d * 9) + ' -5.6' +
      ' q' + r1(-d * 7) + ' -1.6 ' + r1(-(rx * 2) + d * 9) + ' 5.6 z" fill="' + cor + '"/>';
    // mecha / franja
    out += '<path d="M' + r1(x + d * rx * .9) + ' ' + r1(y - 4) + ' q' + r1(-d * 6) + ' 4 ' + r1(-d * 10.5) + ' .6" fill="' + cor + '"/>';
    if (tipo === 'mochila') {
      out += '<circle cx="' + r1(x - d * 17) + '" cy="' + r1(y - 11) + '" r="9" fill="' + cor + '"/>';
      out += '<circle cx="' + r1(x - d * 15.5) + '" cy="' + r1(y - 13) + '" r="4" fill="' + tom(cor, .22) + '" opacity=".7"/>';
    } else if (tipo === 'rabo') {
      out += '<path d="M' + r1(x - d * 14) + ' ' + r1(y - 9) + ' q' + r1(-d * 15) + ' 10 ' + r1(-d * 7) + ' 27" stroke="' + cor +
             '" stroke-width="9" fill="none" stroke-linecap="round"/>';
      out += '<ellipse cx="' + r1(x - d * 20) + '" cy="' + r1(y + 16) + '" rx="4.6" ry="6" fill="' + tom(cor, -.12) + '"/>';
    } else if (tipo === 'coque') {
      out += '<circle cx="' + r1(x - d * 2) + '" cy="' + r1(y - 22) + '" r="10" fill="' + cor + '"/>';
      out += '<circle cx="' + r1(x - d * 4.5) + '" cy="' + r1(y - 24) + '" r="4" fill="' + tom(cor, .25) + '" opacity=".65"/>';
    } else if (tipo === 'curto') {
      out += '<path d="M' + r1(x - rx) + ' ' + r1(y - 4) + ' a' + rx + ' ' + ry + ' 0 0 1 ' + r1(rx * 2) + ' -2 q' +
             r1(-d * 20) + ' 6 ' + r1(-rx * 2) + ' 2 z" fill="' + cor + '"/>';
    }
    return out;
  }

  /* --------------------------------------------------------------------
     MÃOS E TÊNIS
     -------------------------------------------------------------------- */
  function mao(p, antebraco, cor) {
    var a = ang(antebraco, p) + 90;
    var sombra = tom(cor, -.2), luz = tom(cor, .22);
    return '<g transform="translate(' + r1(p[0]) + ',' + r1(p[1]) + ') rotate(' + r1(a) + ')">' +
      '<ellipse cx="0" cy="0" rx="8.5" ry="7.6" fill="' + sombra + '"/>' +
      '<ellipse cx="-0.8" cy="-0.8" rx="7.6" ry="6.8" fill="' + cor + '"/>' +
      '<ellipse cx="-2.2" cy="-2.4" rx="3.4" ry="2.6" fill="' + luz + '" opacity=".8"/>' +
      '<ellipse cx="-6.6" cy="1.6" rx="3.2" ry="2.6" fill="' + cor + '"/>' +
      '</g>';
  }

  function tenis(pe, cor) {
    var d = 1;
    return '<g transform="translate(' + r1(pe[0]) + ',' + r1(pe[1]) + ')">' +
      '<path d="M-9 -11 q-4 0 -4 5 l0 8 q0 4 5 4 l22 0 q7 0 7 -6 q0 -5 -7 -6 l-9 -1 z" fill="' + tom(cor, -.22) + '"/>' +
      '<path d="M-9 -12 q-4 0 -4 5 l0 7 q0 4 5 4 l21 0 q6 0 6 -5 q0 -5 -6 -5 l-9 -1 z" fill="' + cor + '"/>' +
      '<path d="M-9 0 l21 0 q6 0 6 5 l-27 0 z" fill="' + tom(cor, -.3) + '"/>' +
      '<path d="M2 -8 l6 5 M6 -9 l6 5" stroke="' + tom(cor, -.32) + '" stroke-width="1.8" stroke-linecap="round"/>' +
      '<path d="M-6 -9 q4 4 8 0" stroke="' + tom(cor, .4) + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '</g>';
  }

  /* --------------------------------------------------------------------
     CORPO COMPLETO
     -------------------------------------------------------------------- */
  function personagem(pose, c) {
    var s = pose.s, p = pose.p, h = pose.h;
    var br = pose.c, pe = pose.l;
    var g = pose.g || 1;
    var pele = c.pele, roupa = c.roupa;
    var peleEsc = tom(pele, -.22);
    var out = '';

    // sombra no chão (duas camadas = profundidade)
    var cx = s[0] * .34 + p[0] * .66;
    var rxS = Math.abs(p[0] - s[0]) * .40 + 38;
    out += '<ellipse cx="' + r1(cx + 5) + '" cy="280" rx="' + r1(rxS) + '" ry="' + r1(7 + g * 3) + '" fill="rgba(15,23,42,.20)"/>' +
           '<ellipse cx="' + r1(cx + 5) + '" cy="277" rx="' + r1(rxS * .66) + '" ry="' + r1(4.5 + g * 1.6) + '" fill="rgba(15,23,42,.18)"/>';

    /* --- membro de trás (escurecido, dá profundidade) --- */
    out += volume(p, pe[1][0], 30 * g, 22 * g, peleEsc);          // coxa
    out += volume(pe[1][0], pe[1][1], 21 * g, 15 * g, peleEsc);    // canela
    out += tenis(pe[1][1], tom(c.tenis, -.24));
    out += volume(s, br[1][0], 19 * g, 15 * g, peleEsc);
    out += volume(br[1][0], br[1][1], 15 * g, 12 * g, peleEsc);
    out += mao(br[1][1], br[1][0], peleEsc);

    /* --- tronco: pele + regata --- */
    out += troncoPele(pose, c);

    /* --- coxa da frente --- */
    out += volume(p, pe[0][0], 32 * g, 23 * g, pele);

    /* --- calção (cobre o quadril e as duas coxas) --- */
    out += bermuda(pose, c);

    /* --- canela e pé da frente --- */
    out += volume(pe[0][0], pe[0][1], 22 * g, 16 * g, pele);
    out += tenis(pe[0][1], c.tenis);

    /* --- braço da frente --- */
    out += volume(s, br[0][0], 21 * g, 16 * g, pele);
    out += volume(br[0][0], br[0][1], 16 * g, 13 * g, pele);
    out += mao(br[0][1], br[0][0], pele);

    /* --- pescoço e cabeça --- */
    var nk = mix(h, s, 0.42);
    out += volume(mix(h, s, 0.06), nk, 15 * g, 20 * g, tom(pele, -.12));
    out += cabeca(h, c);
    return out;
  }

  /** Tronco nu + regata (as coxas entram depois). `g` = escala de espessura. */
  function troncoPele(pose, c) {
    var s = pose.s, p = pose.p, g = pose.g || 1;
    var peito = mix(s, p, .3), cintura = mix(s, p, .68);
    var pele = c.pele, roupa = c.roupa;
    var out = '';

    // tronco: ombros largos -> peito -> cintura
    out += volume(s, peito, 54 * g, 50 * g, pele);
    out += volume(peito, cintura, 50 * g, 43 * g, pele);

    // abdômen definido
    var abd = mix(peito, cintura, .45);
    out += '<path d="M' + r1(abd[0] - 7 * g) + ' ' + r1(abd[1]) + ' h' + r1(14 * g) + '" stroke="' + tom(pele, -.3) +
           '" stroke-width="' + r1(2.2 * g) + '" stroke-linecap="round" opacity=".5"/>';
    out += '<path d="M' + r1(abd[0]) + ' ' + r1(abd[1] + 4 * g) + ' L' + r1(p[0] - 4 * g) + ' ' + r1(p[1] - 14 * g) +
           '" stroke="' + tom(pele, -.28) + '" stroke-width="' + r1(2 * g) + '" stroke-linecap="round" opacity=".4"/>';

    // regata por cima
    var barra = mix(s, p, .5);
    out += volume(mix(s, p, .04), barra, 60 * g, 52 * g, roupa);
    out += '<path d="' + brilho(mix(s, p, .04), barra, 60 * g, 52 * g) + '" fill="' + tom(roupa, .32) + '" opacity=".45"/>';
    // gola
    out += '<path d="M' + r1(s[0] - 15 * g) + ' ' + r1(s[1] + 3 * g) + ' q' + r1(15 * g) + ' ' + r1(13 * g) + ' ' + r1(30 * g) + ' 0" stroke="' + tom(roupa, -.3) +
           '" stroke-width="' + r1(4.5 * g) + '" fill="none" stroke-linecap="round"/>';

    // barriga (abaixo da regata)
    out += volume(barra, p, 49 * g, 47 * g, pele);
    return out;
  }

  /** Calção: quadril + topo das coxas, com cós, vinco e barra. */
  function bermuda(pose, c) {
    var p = pose.p, g = pose.g || 1;
    var calcao = tom(c.roupa, -.34);
    var g1 = mix(p, pose.l[0][0], .6), g2 = mix(p, pose.l[1][0], .6);
    var out = '';
    out += volume(p, g2, 50 * g, 38 * g, tom(calcao, -.16));
    out += volume(p, g1, 54 * g, 41 * g, calcao);
    // cós
    out += '<path d="M' + r1(p[0] - 24 * g) + ' ' + r1(p[1] - 15 * g) + ' q' + r1(24 * g) + ' -9 ' + r1(48 * g) + ' 0" stroke="' + tom(calcao, .28) +
           '" stroke-width="' + r1(4 * g) + '" fill="none" stroke-linecap="round" opacity=".8"/>';
    // vinco central
    out += '<path d="M' + r1(p[0] - 1) + ' ' + r1(p[1] - 14 * g) + ' l-2 ' + r1(30 * g) + '" stroke="' + tom(calcao, -.3) +
           '" stroke-width="' + r1(2.4 * g) + '" stroke-linecap="round" opacity=".6"/>';
    // barra da perna
    out += '<path d="M' + r1(g1[0] - 19 * g) + ' ' + r1(g1[1] - 5 * g) + ' q' + r1(19 * g) + ' 8 ' + r1(38 * g) + ' -2" stroke="' + tom(calcao, .3) +
           '" stroke-width="' + r1(3.4 * g) + '" fill="none" stroke-linecap="round" opacity=".75"/>';
    return out;
  }

  /* --------------------------------------------------------------------
     CENÁRIO
     -------------------------------------------------------------------- */
  function cenario(c, s) {
    var f = FUNDO[c.grupo] || FUNDO.default;
    var hh = hash((c.grupo || '') + ':' + s);
    var x1 = 58 + (hh >>> 0) % 430, y1 = 34 + (hh >>> 3) % 54;
    var espX = 44 + (hh >>> 5) % 26, espW = 200 + (hh >>> 9) % 120;
    var out = '';

    /* --- paleta / variáveis --- */
    out += '<defs>' +
      '<linearGradient id="bg" x1="0" y1="0" x2=".8" y2="1">' +
        '<stop offset="0%" stop-color="' + f[0] + '"/>' +
        '<stop offset="100%" stop-color="' + f[1] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="luz" cx="50%" cy="18%" r="72%">' +
        '<stop offset="0%" stop-color="#ffffff" stop-opacity=".42"/>' +
        '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="piso" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="rgba(255,255,255,.40)"/>' +
        '<stop offset="46%" stop-color="rgba(15,23,42,.20)"/>' +
        '<stop offset="100%" stop-color="rgba(15,23,42,.34)"/>' +
      '</linearGradient>' +
      '<linearGradient id="aco" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#f1f5f9"/>' +
        '<stop offset="38%" stop-color="#94a3b8"/>' +
        '<stop offset="100%" stop-color="#475569"/>' +
      '</linearGradient>' +
      '<linearGradient id="espelho" x1="0" y1="0" x2=".4" y2="1">' +
        '<stop offset="0%" stop-color="rgba(255,255,255,.30)"/>' +
        '<stop offset="52%" stop-color="rgba(255,255,255,.10)"/>' +
        '<stop offset="100%" stop-color="rgba(15,23,42,.14)"/>' +
      '</linearGradient>' +
      '<linearGradient id="borracha" x1="0" y1="0" x2=".6" y2="1">' +
        '<stop offset="0%" stop-color="' + tom(c.roupa, .18) + '"/>' +
        '<stop offset="100%" stop-color="' + tom(c.roupa, -.35) + '"/>' +
      '</linearGradient>' +
    '</defs>';

    /* --- parede --- */
    out += '<rect width="' + W + '" height="' + H + '" rx="26" fill="url(#bg)"/>';
    /* painéis verticais da parede */
    out += '<g stroke="#ffffff" stroke-width="2" opacity=".09" fill="none">';
    for (var i = 0; i < 8; i++) {
      var px = 24 + i * 74 + ((hh >> i) % 14);
      out += '<path d="M' + px + ' 0 V 252"/>';
    }
    out += '</g>';
    /* teto / luminária */
    out += '<rect x="' + (150 + (hh >>> 0) % 120) + '" y="0" width="300" height="16" rx="8" fill="rgba(255,255,255,.16)"/>';
    out += '<rect x="' + (188 + (hh >>> 0) % 120) + '" y="6" width="224" height="6" rx="3" fill="rgba(255,255,255,.34)"/>';
    out += '<rect width="' + W + '" height="250" fill="url(#luz)"/>';

    /* --- espelho de parede com halteres refletidos --- */
    out += '<rect x="' + r1(espX) + '" y="44" width="' + r1(espW) + '" height="150" rx="14" fill="url(#espelho)" stroke="rgba(255,255,255,.36)" stroke-width="3"/>';
    out += '<path d="M' + r1(espX + 12) + ' 46 L' + r1(espX + espW * .58) + ' 46 L' + r1(espX + 26) + ' 192 L' + r1(espX + 12) + ' 192 Z" fill="rgba(255,255,255,.10)"/>';
    for (var k = 0; k < 3; k++) {
      var hx = espX + 26 + k * ((espW - 52) / 2.6);
      out += '<ellipse cx="' + r1(hx) + '" cy="' + (176 + (hh >>> (k + 4)) % 8) + '" rx="9" ry="7" fill="rgba(15,23,42,.24)"/>';
      out += '<ellipse cx="' + r1(hx + 15) + '" cy="' + (176 + (hh >>> (k + 4)) % 8) + '" rx="9" ry="7" fill="rgba(15,23,42,.18)"/>';
    }

    /* --- halos decorativos --- */
    out += '<circle cx="' + x1 + '" cy="' + y1 + '" r="74" fill="rgba(255,255,255,.16)"/>';
    out += '<circle cx="' + (x1 + 178) + '" cy="' + (y1 + 106) + '" r="41" fill="rgba(255,255,255,.12)"/>';
    out += '<circle cx="' + (W - 52) + '" cy="' + (44 + (s >>> 8) % 36) + '" r="16" fill="rgba(255,255,255,.22)"/>';

    /* --- piso com perspectiva --- */
    out += '<path d="M0 250 Q 150 232 300 246 T 600 240 L 600 320 L 0 320 Z" fill="url(#piso)"/>';
    out += '<g stroke="rgba(255,255,255,.13)" stroke-width="2" fill="none">';
    for (var j = -2; j < 9; j++) {
      out += '<path d="M' + (300 + j * 26) + ' 246 L' + (300 + j * 108) + ' 320"/>';
    }
    out += '</g>';
    out += '<path d="M0 268 H 600 M 0 296 H 600" stroke="rgba(15,23,42,.10)" stroke-width="2"/>';

    /* --- linha de apoio (onde os pés encostam) --- */
    out += '<path d="M34 278 h532" stroke="rgba(255,255,255,.34)" stroke-width="3" stroke-linecap="round"/>';
    out += '<path d="M28 288 h544" stroke="rgba(15,23,42,.17)" stroke-width="10" stroke-linecap="round"/>';
    out += estrelas(s);
    return out;
  }

  /** Vinheta escura nas bordas — aplicada por cima de tudo, dá profundidade. */
  function vinheta() {
    return '<defs><radialGradient id="vin" cx="50%" cy="48%" r="72%">' +
      '<stop offset="55%" stop-color="#000000" stop-opacity="0"/>' +
      '<stop offset="100%" stop-color="#0b1220" stop-opacity=".34"/>' +
      '</radialGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" rx="26" fill="url(#vin)"/>';
  }

  function estrelas(s) {
    var pts = [[104, 58 + (s >>> 0) % 22], [478, 186 + (s >>> 3) % 34], [528, 76], [80, 208]];
    var out = '';
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], r = 5 + (s >>> (i + 1)) % 4, o = .55 + ((s >>> (i + 2)) % 3) * .15;
      out += '<path d="M' + p[0] + ' ' + (p[1] - r) + 'l' + (r * .38) + ' ' + (r * .62) +
        'l' + (r * .62) + ' ' + (r * .38) + 'l-' + (r * .62) + ' ' + (r * .38) +
        'l' + (r * .38) + ' ' + (r * .62) + 'l' + (r * .62) + ' -' + (r * .38) +
        'l-' + (r * .38) + ' -' + (r * .62) + 'l-' + (r * .62) + ' -' + (r * .38) + 'z" fill="rgba(255,255,255,' + o + ')"/>';
    }
    return out;
  }

  /* Gotas de suor / linhas de movimento (usadas nos exercícios de esforço) */
  function esforco(s, n) {
    var out = '', base = n || 3;
    for (var i = 0; i < base; i++) {
      var x = 470 + (i * 26) % 90, y = 96 + ((s >>> (i * 2)) % 40) + i * 22;
      out += '<path d="M' + x + ' ' + y + ' c-6 8 -9 13 -9 18 a9 9 0 0 0 18 0 c0 -5 -3 -10 -9 -18 z" fill="rgba(255,255,255,.72)"/>';
      out += '<circle cx="' + (x - 3) + '" cy="' + (y + 15) + '" r="2.6" fill="rgba(255,255,255,.95)"/>';
    }
    return out;
  }

  /* =====================================================================
     PARTE 2 — EQUIPAMENTOS, POSE DE CADA EXERCÍCIO E MONTAGEM FINAL
     ===================================================================== */

  /* --------------------------------------------------------------------
     PRIMITIVAS DE EQUIPAMENTO
     -------------------------------------------------------------------- */
  /** Retângulo com cantos arredondados, opcionalmente rotacionado no centro. */
  function ret(cx, cy, w, h, deg, fill, rx) {
    return '<rect x="' + r1(cx - w / 2) + '" y="' + r1(cy - h / 2) + '" width="' + r1(w) +
           '" height="' + r1(h) + '" rx="' + (rx || 0) + '" fill="' + fill + '"' +
           (deg ? ' transform="rotate(' + r1(deg) + ' ' + r1(cx) + ' ' + r1(cy) + ')"' : '') + '/>';
  }

  /** Tubo (cápsula) entre dois pontos — o "osso" de qualquer estrutura. */
  function tubo(a, b, w, fill, op) {
    var cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
    var deg = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    return '<rect x="' + r1(cx - w / 2) + '" y="' + r1(cy - w / 2) + '" width="' + r1(w) +
           '" height="' + r1(w) + '" rx="' + r1(w / 2) + '" fill="' + fill + '"' +
           (op != null ? ' opacity="' + op + '"' : '') +
           ' transform="rotate(' + r1(deg) + ' ' + r1(cx) + ' ' + r1(cy) + ')"/>';
  }

  /** Anilha de barra / disco de borracha. */
  function anilha(x, y, r, ry) {
    ry = ry || r;
    return '<ellipse cx="' + r1(x) + '" cy="' + r1(y) + '" rx="' + r1(r) + '" ry="' + r1(ry) + '" fill="#0b1220"/>' +
           '<ellipse cx="' + r1(x - 1) + '" cy="' + r1(y) + '" rx="' + r1(r - 2) + '" ry="' + r1(ry - 2) + '" fill="#334155"/>' +
           '<ellipse cx="' + r1(x - 1.4) + '" cy="' + r1(y - 1) + '" rx="' + r1(r - 4.4) + '" ry="' + r1(ry - 4.4) + '" fill="#64748b" opacity=".65"/>';
  }

  /** Barra reta com punho e anilhas. */
  function barra(cx, cy, larg, esp) {
    esp = esp == null ? 1 : esp;
    var out = tubo([cx - larg / 2, cy], [cx + larg / 2, cy], 6.4, 'url(#aco)');
    out += tubo([cx - 38, cy], [cx + 38, cy], 9.4, '#334155');
    out += tubo([cx - 38, cy - 1.6], [cx + 38, cy - 1.6], 3, '#7c8ca1', '.8');
    out += anilha(cx - larg / 2 + 9, cy, 5 + esp * 3.2, 13 + esp * 10.5);
    out += anilha(cx + larg / 2 - 9, cy, 5 + esp * 3.2, 13 + esp * 10.5);
    return out;
  }

  /** Barra de rosca (EZ / reta) sem anilhas. */
  function barraLeve(cx, cy, larg) {
    return tubo([cx - larg / 2, cy], [cx + larg / 2, cy], 6.2, 'url(#aco)') +
           tubo([cx - larg / 2, cy - 1.4], [cx + larg / 2, cy - 1.4], 2.4, '#cbd5e1', '.7');
  }

  /** Halter na mão (x,y), girado `deg`. */
  function halter(x, y, deg, comp) {
    comp = comp == null ? 1 : comp;
    var w = 5.5 + comp * 2.6, h = 9 + comp * 4.2;
    var out = '<g transform="rotate(' + r1(deg || 0) + ' ' + r1(x) + ' ' + r1(y) + ')">';
    out += '<rect x="' + r1(x - 10) + '" y="' + r1(y - 3.6) + '" width="20" height="7.2" rx="3.6" fill="#334155"/>';
    out += '<rect x="' + r1(x - 10) + '" y="' + r1(y - 3.6) + '" width="20" height="2.4" rx="1.2" fill="#7c8ca1"/>';
    var i, sx;
    for (i = 0; i < 2; i++) {
      sx = i ? x + 10 : x - 10 - w;
      out += '<rect x="' + r1(sx) + '" y="' + r1(y - h / 2) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + r1(w * .42) + '" fill="#0f172a"/>';
      out += '<rect x="' + r1(sx) + '" y="' + r1(y - h / 2) + '" width="' + r1(w * .58) + '" height="' + r1(h) + '" rx="' + r1(w * .28) + '" fill="#44536a"/>';
    }
    return out + '</g>';
  }

  /** Corda de polia (noveirinhas). */
  function corda(x, y, deg) {
    var out = '<g transform="rotate(' + r1(deg || 0) + ' ' + r1(x) + ' ' + r1(y) + ')">';
    out += tubo([x, y - 24], [x, y], 3.6, '#e2e8f0');
    var i, rr;
    for (i = 0; i < 7; i++) {
      rr = 5.4 - i * .34;
      out += '<ellipse cx="' + r1(x) + '" cy="' + r1(y + 5 + i * 6.4) + '" rx="' + r1(rr) + '" ry="4.4" fill="#cbd5e1"/>' +
             '<ellipse cx="' + r1(x - 1.4) + '" cy="' + r1(y + 4 + i * 6.4) + '" rx="' + r1(rr * .4) + '" ry="2" fill="#f8fafc" opacity=".8"/>';
    }
    return out + '</g>';
  }

  /** Cabo de aço da polia. */
  function cabo(a, b, w, cor) {
    return tubo(a, b, w || 3.2, cor || '#475569');
  }

  /** Elástico / faixa de resistência. */
  function elastico(a, b, w, cor) {
    cor = cor || '#22c55e';
    return tubo(a, b, w || 9, cor) + tubo(a, b, (w || 9) * .38, 'rgba(255,255,255,.45)', '.55');
  }

  /** Almofada com a cor da roupa. */
  function almofada(cx, cy, w, h, deg) {
    var a = (deg || 0) * Math.PI / 180;
    return ret(cx, cy, w, h, deg, 'url(#borracha)', Math.min(h, w) * .45) +
           ret(cx + Math.sin(a) * (h * .3), cy - Math.cos(a) * (h * .3), w * .9, h * .26, deg, 'rgba(255,255,255,.30)', h * .13);
  }

  /** Banco horizontal de musculação. */
  function banco(c, x, y, w) {
    var fy = CHAO + 12;
    var out = '';
    out += tubo([x + w * .15, y + 10], [x + w * .15, fy], 9, 'url(#aco)');
    out += tubo([x + w * .85, y + 10], [x + w * .85, fy], 9, 'url(#aco)');
    out += tubo([x + w * .15, y + 34], [x + w * .85, y + 34], 6, '#64748b');
    out += ret(x + w * .5, fy, w * .8, 7, 0, '#475569', 3.5);
    out += almofada(x + w / 2, y + 8, w, 16, 0);
    return out;
  }

  /** Banco inclinado: `deg` negativo = lado esquerdo (cabeça) mais alto. */
  function bancoIncl(c, cx, cy, w, deg) {
    var a = deg * Math.PI / 180;
    var out = '';
    out += tubo([cx - w * .34, CHAO + 10], [cx + w * .38, CHAO + 10], 11, 'url(#aco)');
    out += tubo([cx + w * .22, CHAO + 8], [cx + w * .06, cy + 34], 11, 'url(#aco)');
    out += ret(cx, cy, w, 16, deg, 'url(#borracha)', 7.5);
    out += ret(cx + Math.sin(a) * 5, cy - Math.cos(a) * 5, w * .9, 4.4, deg, 'rgba(255,255,255,.30)', 2.2);
    return out;
  }

  /** Banco vertical (rosca Scott,Supported). */
  function bancoVert(c, x, y, h) {
    var out = '';
    out += tubo([x, y + 8], [x, CHAO + 10], 11, 'url(#aco)');
    out += tubo([x - 24, CHAO + 10], [x + 22, CHAO + 10], 11, 'url(#aco)');
    out += ret(x, y - h / 2, 22, h, 0, 'url(#borracha)', 7);
    out += ret(x, y - h / 2 - 3, 15, 8, 0, 'rgba(255,255,255,.26)', 3);
    return out;
  }

  /** Portes de barra fixa / rack de agachamento. */
  function rack(c, x1, x2, y) {
    var out = '';
    out += tubo([x1, y], [x1, CHAO + 10], 13, 'url(#aco)');
    out += tubo([x2, y], [x2, CHAO + 10], 13, 'url(#aco)');
    out += tubo([x1 - 28, CHAO + 10], [x1 + 18, CHAO + 10], 11, '#475569');
    out += tubo([x2 - 18, CHAO + 10], [x2 + 28, CHAO + 10], 11, '#475569');
    out += tubo([x1 - 6, y], [x2 + 6, y], 13, 'url(#aco)');
    out += tubo([x1 - 6, y - 2.6], [x2 + 6, y - 2.6], 3.4, '#e2e8f0', '.65');
    return out;
  }

  /** Par de paralelas (a de trás vai no layer "b", a da frente em "f"). */
  function paralelasTras(x1, y) {
    return tubo([x1 - 8, y], [x1 - 16, CHAO + 8], 10, 'url(#aco)') +
           tubo([x1 - 30, CHAO + 8], [x1 + 8, CHAO + 8], 9, '#475569') +
           tubo([x1 - 20, y], [x1 + 2, y], 12, 'url(#borracha)');
  }
  function paralelasFrente(x2, y) {
    return tubo([x2 + 8, y], [x2 + 16, CHAO + 8], 10, 'url(#aco)') +
           tubo([x2 - 8, CHAO + 8], [x2 + 30, CHAO + 8], 9, '#475569') +
           tubo([x2 - 2, y], [x2 + 20, y], 12, 'url(#borracha)');
  }

  /** Torre de polia (cabo na parte alta ou baixa). */
  function torre(c, x, y1, y2, lado) {
    var dx = (lado === -1 ? -17 : 17);
    var out = '';
    out += ret(x, (y1 + y2) / 2, 15, y2 - y1, 0, 'url(#aco)', 7);
    out += ret(x - 4, (y1 + y2) / 2, 5, y2 - y1 - 16, 0, 'rgba(255,255,255,.32)', 2.5);
    out += ret(x, CHAO + 9, 68, 12, 0, 'url(#aco)', 5);
    out += '<circle cx="' + r1(x + dx) + '" cy="' + r1(y1) + '" r="9.5" fill="#0f172a"/>';
    out += '<circle cx="' + r1(x + dx) + '" cy="' + r1(y1) + '" r="5.5" fill="#94a3b8"/>';
    out += '<circle cx="' + r1(x + dx - 1.4) + '" cy="' + r1(y1 - 1.4) + '" r="2" fill="#f1f5f9"/>';
    return out;
  }

  function baseMaq(x, w) {
    return ret(x, CHAO + 9, w, 12, 0, 'url(#aco)', 5) +
           ret(x, CHAO + 2, w * .9, 4, 0, 'rgba(255,255,255,.32)', 2);
  }
  function poste(x, y1, y2) {
    return tubo([x, y1], [x, y2], 16, 'url(#aco)') +
           tubo([x - 4.4, y1], [x - 4.4, y2], 5, 'rgba(255,255,255,.30)');
  }
  function tapete(c, x, y, w) {
    return ret(x + w / 2, y, w, 10, 0, 'url(#borracha)', 5) +
           ret(x + w / 2, y - 2.5, w * .93, 4.4, 0, 'rgba(255,255,255,.34)', 2.2);
  }
  function caixa(c, x, y, w, h) {
    return ret(x + w / 2, y + h / 2, w, h, 0, '#b45309', 3) +
           ret(x + w / 2, y + 3, w, 6, 0, '#d97706', 2) +
           '<path d="M' + r1(x + w * .32) + ' ' + r1(y + 7) + ' v' + r1(h - 9) + '" stroke="#92400e" stroke-width="2" opacity=".45"/>';
  }
  /** Seta de movimento (exercícios dinâmicos). */
  function seta(x, y, deg, cor) {
    return '<g transform="rotate(' + r1(deg) + ' ' + r1(x) + ' ' + r1(y) + ')">' +
      '<path d="M' + r1(x - 26) + ' ' + r1(y) + ' h34" stroke="' + (cor || 'rgba(255,255,255,.7)') + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M' + r1(x + 8) + ' ' + r1(y - 8) + ' l12 8 l-12 8 z" fill="' + (cor || 'rgba(255,255,255,.7)') + '"/></g>';
  }

  /* --------------------------------------------------------------------
     CONJUNTO DE EQUIPAMENTOS POR FAMÍLIA
     Devolve { b: desenhado atrás da pessoa, f: desenhado à frente }.
     -------------------------------------------------------------------- */
  var EQ = {};

  /* --- Peito --- */
  EQ.bancoReto = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 250, 316) };
  };
  EQ.supinoBarra = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 250, 316) + banco(c, 148, 250, 316) +
                   barra(ma + 3, ma[1], 168, 1.1) + poste(146, 150, 258) + poste(452, 150, 258) +
                   tubo([140, 158], [458, 158], 12, 'url(#aco)') };
  };
  EQ.supinoHalter = function (c, p) {
    var ma = p.c[1], el = p.c[0];
    return { b: banco(c, 148, 250, 316) +
      halter(ma[0][0], ma[0][1], 0, 1) + halter(ma[1][0], ma[1][1], 0, 1) };
  };
  EQ.supinoIncl = function (c, p) {
    var ma = p.c[1][0];
    return { b: bancoIncl(c, 268, 186, 208, -34) + barra(ma[0] + 2, ma[1] - 2, 150, 1) };
  };
  EQ.supinoInclHalter = function (c, p) {
    var ma = p.c[1];
    return { b: bancoIncl(c, 268, 186, 208, -34) +
      halter(ma[0][0], ma[0][1], 0, 1) + halter(ma[1][0], ma[1][1], 0, 1) };
  };
  EQ.declinado = function (c, p) {
    var ma = p.c[1][0];
    var out = bancoIncl(c, 292, 246, 232, 20) + barra(ma[0] + 2, ma[1], 150, .9);
    return { b: out };
  };
  EQ.fly = function (c, p) {
    var ma = p.c[1];
    return { b: bancoIncl(c, 258, 176, 214, -26) +
      halter(ma[0][0], ma[0][1], 8, .8) + halter(ma[1][0], ma[1][1], 8, .8) };
  };
  EQ.crucifixoMaq = function (c, p) {
    var ma = p.c[1];
    return { b: bancoIncl(c, 252, 184, 200, -30) +
      tubo([368, 138], [368, 214], 13, 'url(#aco)') +
      '<circle cx="368" cy="120" r="12" fill="#0f172a"/><circle cx="368" cy="120" r="5" fill="#94a3b8"/>' +
      cabo([368, 120], [ma[0][0], ma[0][1]], 3) + cabo([368, 120], [ma[1][0], ma[1][1]], 3) +
      almofada(310, 132, 74, 15, 0) };
  };
  EQ.crossover = function (c, p) {
    var ma = p.c[1];
    return { b: poste(452, 40, CHAO + 9) + tubo([446, 48], [478, 48], 12, 'url(#aco)') +
      baseMaq(452, 74) + baseMaq(300, 60) +
      cabo([470, 52], [ma[0][0], ma[0][1]], 3) + cabo([470, 52], [ma[1][0], ma[1][1]], 3) +
      '<circle cx="470" cy="52" r="9" fill="#0f172a"/><circle cx="470" cy="52" r="4" fill="#94a3b8"/>' };
  };
  EQ.flexao = function (c, p) {
    return { b: tapete(c, 120, 286, 360) };
  };

  /* --- Costas --- */
  EQ.puxadaAlta = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(120, 38, CHAO + 9) + poste(438, 38, CHAO + 9);
    out += tubo([112, 46], [446, 46], 13, 'url(#aco)');
    out += baseMaq(279, 320);
    out += almofada(300, 234, 100, 17, 0);
    out += tubo([268, 242], [268, CHAO + 9], 11, 'url(#aco)');
    out += almofada(358, 200, 22, 78, 8);
    out += barraLeve(ma[0] + 5, ma[1], 44);
    return { b: out };
  };
  EQ.puxadaNeutra = function (c, p) {
    var ma = p.c[1][0];
    var out = EQ.puxadaAlta(c, p).b;
    out += tubo([ma[0], ma[1] + 6], [ma[0] + 9, ma[1] + 16], 7, '#334155');
    out += tubo([ma[1], ma[1] + 6], [ma[1] - 9, ma[1] + 16], 7, '#334155');
    return { b: out };
  };
  EQ.puxadaAtras = EQ.puxadaAlta;
  EQ.barraFixa = function (c, p) {
    return { b: rack(c, 150, 452, 46) };
  };
  EQ.remadaBaixa = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 470, 52, 250, -1);
    out += almofada(288, 232, 104, 17, 0);
    out += tubo([256, 240], [256, CHAO + 9], 11, 'url(#aco)');
    out += ret(368, 284, 78, 12, 0, 'url(#aco)', 4);
    out += cabo([453, 60], [ma[0], ma[1]], 3);
    out += barraLeve(ma[0] + 6, ma[1], 34);
    return { b: out };
  };
  EQ.remadaCurvada = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 252, 180) + barra(ma[0] + 2, ma[1], 158, 1) };
  };
  EQ.remadaUnilateral = function (c, p) {
    var ma = p.c[1][0];
    var out = banco(c, 150, 250, 170);
    out += halter(ma[0], ma[1], -14, 1.2);
    out += almofada(228, 196, 24, 68, 10);
    return { b: out };
  };
  EQ.remadaArticulada = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(180, 84, CHAO + 9) + poste(452, 84, CHAO + 9);
    out += tubo([172, 92], [460, 92], 12, 'url(#aco)');
    out += baseMaq(316, 300);
    out += almofada(300, 236, 104, 17, 0);
    out += almofada(238, 172, 26, 96, 0);
    out += tubo([330, 186], [ma[0] + 4, ma[1]], 8, 'url(#aco)');
    out += tubo([ma[0], ma[1]], [ma[1] - 6, ma[1] + 6], 8, 'url(#aco)');
    return { b: out };
  };
  EQ.pullover = function (c, p) {
    var ma = p.c[1][0];
    var out = banco(c, 148, 250, 300);
    out += poste(524, 40, CHAO + 9) + tubo([518, 48], [550, 48], 12, 'url(#aco)');
    out += '<circle cx="542" cy="52" r="9" fill="#0f172a"/><circle cx="542" cy="52" r="4" fill="#94a3b8"/>';
    out += cabo([542, 52], [ma[0], ma[1]], 3);
    out += barraLeve(ma[0] + 4, ma[1], 40);
    return { b: out };
  };
  EQ.terra = function (c, p) {
    var ma = p.c[1][0];
    return { b: barra(300, 176, 214, 1.4) + anilha(196, 176, 9, 26) + anilha(404, 176, 9, 26) };
  };
  EQ.stiff = function (c, p) {
    var ma = p.c[1][0];
    return { b: barra(ma[0] + 2, ma[1], 176, 1.3) + anilha(ma[0] - 76, ma[1], 8, 23) + anilha(ma[0] + 80, ma[1], 8, 23) };
  };
  EQ.stiffHalter = function (c, p) {
    var ma = p.c[1];
    return { b: halter(ma[0][0], ma[0][1], 0, 1.2) + halter(ma[1][0], ma[1][1], 0, 1.2) };
  };
  EQ.remadaAlta = function (c, p) {
    var ma = p.c[1][0];
    return { b: barra(ma[0] + 6, ma[1], 132, 1) };
  };
  EQ.crucifixoInverso = function (c, p) {
    var ma = p.c[1];
    return { b: halter(ma[0][0], ma[0][1], 0, .8) + halter(ma[1][0], ma[1][1], 0, .8) };
  };
  EQ.facePull = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 476, 44, 250, -1);
    out += cabo([459, 52], [ma[0] + 4, ma[1]], 3);
    out += corda(ma[0], ma[1], 24);
    return { b: out };
  };
  EQ.lateralPolia = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(500, 96, CHAO + 9) + tubo([494, 104], [530, 104], 12, 'url(#aco)');
    out += '<circle cx="516" cy="106" r="9" fill="#0f172a"/><circle cx="516" cy="106" r="4" fill="#94a3b8"/>';
    out += cabo([516, 106], [ma[0], ma[1]], 3);
    out += cabo([516, 106], [ma[1] - 4, ma[1]], 3);
    return { b: out };
  };

  /* --- Ombros --- */
  EQ.desenvHalter = function (c, p) {
    var ma = p.c[1];
    var out = banco(c, 246, 236, 118);
    out += halter(ma[0][0], ma[0][1], 0, 1) + halter(ma[1][0], ma[1][1], 0, 1);
    return { b: out };
  };
  EQ.desenvBarra = function (c, p) {
    var ma = p.c[1][0];
    var out = banco(c, 244, 238, 120);
    out += barra(ma[0] + 2, ma[1] - 4, 176, 1.1);
    out += poste(150, 96, CHAO + 9) + poste(452, 96, CHAO + 9);
    out += tubo([142, 104], [460, 104], 12, 'url(#aco)');
    return { b: out };
  };
  EQ.desenvMaq = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(180, 52, CHAO + 9) + poste(430, 52, CHAO + 9);
    out += tubo([172, 60], [438, 60], 12, 'url(#aco)');
    out += baseMaq(305, 280);
    out += almofada(300, 238, 104, 17, 0);
    out += almofada(250, 150, 24, 80, 0);
    out += tubo([352, 96], [ma[0], ma[1]], 8, 'url(#aco)');
    out += ret(400, ma[1], 40, 16, 0, 'url(#borracha)', 7);
    return { b: out };
  };
  EQ.lateral = function (c, p) {
    var ma = p.c[1];
    return { b: halter(ma[0][0], ma[0][1], 0, .8) + halter(ma[1][0], ma[1][1], 0, .8) };
  };
  EQ.halterPar = function (c, p) {
    var ma = p.c[1];
    return { b: halter(ma[0][0], ma[0][1], 0, .9) + halter(ma[1][0], ma[1][1], 0, .9) };
  };

  /* --- Braços --- */
  EQ.barraRosca = function (c, p) {
    var ma = p.c[1][0];
    return { b: barraLeve(ma[0] + 4, ma[1], 118) + anilha(ma[0] - 50, ma[1], 7, 18) + anilha(ma[0] + 58, ma[1], 7, 18) };
  };
  EQ.roscaPolia = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 470, 44, 250, -1);
    out += cabo([453, 52], [ma[0], ma[1]], 3);
    out += barraLeve(ma[0] + 4, ma[1], 40);
    return { b: out };
  };
  EQ.scott = function (c, p) {
    var ma = p.c[1][0];
    var out = banco(c, 240, 236, 122);
    out += bancoVert(c, 356, 214, 62);
    out += barraLeve(ma[0] + 4, ma[1], 54);
    out += anilha(ma[0] - 22, ma[1], 6.5, 16) + anilha(ma[0] + 30, ma[1], 6.5, 16);
    return { b: out };
  };
  EQ.roscaIncl = function (c, p) {
    var ma = p.c[1][0];
    var out = bancoIncl(c, 262, 226, 150, -22);
    out += halter(ma[0][0], ma[0][1], 0, .9) + halter(ma[1][0], ma[1][1], 0, .9);
    return { b: out };
  };
  EQ.tricepsPolia = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 476, 44, 250, -1);
    out += cabo([459, 52], [ma[0] - 4, ma[1]], 3);
    out += barraLeve(ma[0] - 4, ma[1], 38);
    return { b: out };
  };
  EQ.cordaPolia = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 476, 44, 250, -1);
    out += cabo([459, 52], [ma[0], ma[1]], 3);
    out += corda(ma[0], ma[1], 0);
    return { b: out };
  };
  EQ.tricepsTesta = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 250, 316) + barraLeve(ma[0] + 2, ma[1], 112) +
                   anilha(ma[0] - 50, ma[1], 6.5, 16) + anilha(ma[0] + 56, ma[1], 6.5, 16) };
  };
  EQ.frances = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 250, 316) + barraLeve(ma[0] + 2, ma[1], 104) +
                   anilha(ma[0] - 46, ma[1], 6.5, 16) + anilha(ma[0] + 52, ma[1], 6.5, 16) };
  };
  EQ.paralelas = function (c, p) {
    var y = 214;
    return { b: paralelasTras(286, y), f: paralelasFrente(388, y) };
  };
  EQ.mergulhoBanco = function (c, p) {
    return { b: banco(c, 190, 262, 200) };
  };
  EQ.supinoFechado = function (c, p) {
    var ma = p.c[1][0];
    return { b: banco(c, 148, 250, 316) + poste(146, 150, 258) + poste(452, 150, 258) +
                   tubo([140, 158], [458, 158], 12, 'url(#aco)') +
                   barraLeve(ma[0] + 2, ma[1], 92) + anilha(ma[0] - 40, ma[1], 6, 15) + anilha(ma[0] + 44, ma[1], 6, 15) };
  };

  /* --- Pernas --- */
  EQ.agachamento = function (c, p) {
    var ma = p.c[1][0];
    var out = rack(c, 138, 468, 104);
    out += barra(ma[0] - 4, ma[1] - 6, 210, 1.3);
    return { b: out };
  };
  EQ.smith = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(122, 60, CHAO + 9) + poste(486, 60, CHAO + 9);
    out += tubo([116, 68], [492, 68], 12, 'url(#aco)');
    out += baseMaq(304, 400);
    out += '<rect x="122" y="94" width="14" height="' + r1(CHAO - 96) + '" fill="#94a3b8" opacity=".45"/>';
    out += '<rect x="472" y="94" width="14" height="' + r1(CHAO - 96) + '" fill="#94a3b8" opacity=".45"/>';
    out += barra(ma[0] - 4, ma[1] - 6, 200, 1.2);
    return { b: out };
  };
  EQ.legPress = function (c, p) {
    var pe = p.l[1][0];
    var out = '';
    out += tubo([150, CHAO + 6], [430, 128], 15, 'url(#aco)');
    out += tubo([150, CHAO + 6], [430, 128], 5, 'rgba(255,255,255,.34)');
    out += baseMaq(300, 300);
    // encosto a 45°
    out += ret(238, 208, 190, 20, -45, '#334155', 9);
    out += ret(238, 208, 190, 12, -45, '#475569', 6);
    // manípulos
    out += tubo([300, 246], [318, 214], 8, '#334155');
    // plataforma dos pés a 45°
    out += ret(398, 150, 16, 128, -34, '#334155', 6);
    out += ret(398, 150, 10, 116, -34, '#475569', 4);
    out += '<circle cx="' + r1(398 + 16) + '" cy="' + r1(150 + 52) + '" r="6" fill="#0f172a"/>';
    out += '<circle cx="' + r1(398 + 16) + '" cy="' + r1(150 - 52) + '" r="6" fill="#0f172a"/>';
    return { b: out };
  };
  EQ.extensora = function (c, p) {
    var pe = p.l[1][0];
    var out = poste(186, 88, CHAO + 9) + baseMaq(320, 260);
    out += almofada(238, 172, 22, 100, -8);
    out += almofada(276, 218, 92, 16, 0);
    out += tubo([258, 224], [258, CHAO + 9], 12, 'url(#aco)');
    out += ret(328, 208, 66, 15, -16, '#334155', 7);      // apoio da coxa
    out += ret(384, 156, 15, 116, 16, '#334155', 6);      // placa dos pés
    out += ret(384, 156, 9, 104, 16, '#475569', 4);
    return { b: out };
  };
  EQ.hack = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(492, 60, CHAO + 9) + tubo([486, 68], [540, 68], 13, 'url(#aco)');
    out += baseMaq(330, 300);
    out += ret(322, 196, 176, 22, -40, '#334155', 9);
    out += ret(322, 196, 176, 13, -40, '#475569', 6);
    out += ret(408, 250, 26, 20, 0, '#334155', 6);
    out += barra(ma[0] - 4, ma[1] - 6, 190, 1.3);
    return { b: out };
  };
  EQ.mesaFlexora = function (c, p) {
    return { b: banco(c, 148, 250, 250) + poste(500, 96, CHAO + 9) + tubo([494, 104], [530, 104], 12, 'url(#aco)') +
      '<circle cx="516" cy="106" r="9" fill="#0f172a"/><circle cx="516" cy="106" r="4" fill="#94a3b8"/>' +
      cabo([516, 106], [p.l[1][0][0] - 6, p.l[1][0][1] + 8], 3) };
  };
  EQ.cadeiraFlexora = function (c, p) {
    var out = poste(172, 80, CHAO + 9) + baseMaq(330, 280);
    out += almofada(292, 238, 104, 17, 0);
    out += almofada(250, 176, 24, 92, 0);
    out += ret(392, 224, 16, 118, -12, '#334155', 6);
    out += ret(392, 224, 10, 106, -12, '#475569', 4);
    out += cabo([386, 168], [p.l[1][0][0] + 4, p.l[1][0][1]], 3);
    return { b: out };
  };
  EQ.hipThrust = function (c, p) {
    var out = banco(c, 158, 246, 200);
    out += banco(c, 190, 284, 210);
    out += barra(p.p[0] - 4, p.p[1] - 10, 178, 1.1);
    return { b: out };
  };
  EQ.coicePolia = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 468, 44, 250, -1);
    out += cabo([451, 52], [ma[0] + 6, ma[1]], 3);
    out += '<rect x="' + r1(ma[0] - 8) + '" y="' + r1(ma[1] - 5) + '" width="16" height="12" rx="4" fill="#334155"/>';
    return { b: out };
  };
  EQ.abducao = function (c, p) {
    var out = poste(200, 108, CHAO + 9) + baseMaq(300, 240);
    out += almofada(292, 240, 96, 16, 0);
    out += almofada(258, 194, 22, 84, 0);
    out += ret(348, 214, 14, 86, 6, '#334155', 6);
    out += ret(348, 214, 9, 76, 6, '#475569', 4);
    return { b: out };
  };
  EQ.bandaQuadril = function (c, p) {
    var j = p.l[0];
    return { b: elastico([j[0][0] - 16, j[0][1] - 4], [j[1][0] + 16, j[1][1] - 4], 10, '#f59e0b') +
                 elastico([j[0][0] - 15, j[0][1] + 12], [j[1][0] + 15, j[1][1] + 12], 8, '#fbbf24') };
  };
  EQ.panturrilha = function (c, p) {
    var pe = p.l[1][0];
    var out = poste(500, 150, CHAO + 9);
    out += ret(430, 284, 96, 12, 0, 'url(#aco)', 5);
    out += ret(430, 278, 88, 5, 0, 'rgba(255,255,255,.3)', 2);
    return { b: out };
  };
  EQ.panturrilhaSent = function (c, p) {
    var out = poste(184, 92, CHAO + 9) + baseMaq(300, 260);
    out += almofada(286, 234, 100, 17, 0);
    out += ret(390, 232, 16, 96, -10, '#334155', 6);
    out += ret(390, 232, 10, 84, -10, '#475569', 4);
    return { b: out };
  };

  /* --- Core / Cardio --- */
  EQ.tapete = function (c, p) { return { b: tapete(c, 110, 288, 380) }; };
  EQ.abdominalMaquina = function (c, p) {
    var ma = p.c[1][0];
    var out = poste(196, 96, CHAO + 9) + baseMaq(320, 260);
    out += almofada(292, 236, 100, 17, 0);
    out += almofada(252, 182, 24, 92, 0);
    out += ret(384, 186, 15, 96, 12, '#334155', 6);
    out += cabo([380, 150], [ma[0], ma[1]], 3);
    return { b: out };
  };
  EQ.abdominalPolia = function (c, p) {
    var ma = p.c[1][0];
    var out = torre(c, 470, 40, 250, -1);
    out += tapete(c, 140, 288, 250);
    out += cabo([453, 48], [ma[0], ma[1]], 3);
    out += '<rect x="' + r1(ma[0] - 8) + '" y="' + r1(ma[1] - 4) + '" width="16" height="10" rx="4" fill="#334155"/>';
    return { b: out };
  };
  EQ.caixa = function (c, p) { return { b: caixa(c, 168, 236, 130, 52) + tapete(c, 300, 288, 240) }; };
  EQ.cordaPular = function (c, p) {
    var ma = p.c[1][0], m2 = p.c[1][1];
    var out = cabo(ma, [300, 292], 2.6, '#f8fafc');
    out += cabo(m2, [300, 292], 2.6, '#f8fafc');
    out += tubo([296, 292], [304, 292], 8, '#334155');
    return { b: out };
  };
  EQ.semEquip = function () { return {}; };

  /* --------------------------------------------------------------------
     MONTAGEM DE POSE
     -------------------------------------------------------------------- */
  function combina(base, o) {
    var r = {}, k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) r[k] = base[k];
    if (o) for (k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k];
    return r;
  }

  /** Cria uma pose completa. Ordem: cabeça, ombro, quadril, cotovelos,
      mãos, joelhos, pés e opções extras. */
  function P(h, s, q, el, ma, jo, pe, o) {
    return combina({
      h: h, s: s, p: q, c: [el, ma], l: [jo, pe],
      g: 1, rot: 0, dir: 1, view: 'front', forca: 0, eq: null
    }, o);
  }

  /* --- poses-base --- */
  function emPe(o) {
    return P([300, 74], [300, 98], [300, 156],
      [[306, 140], [294, 140]], [[312, 182], [288, 182]],
      [[300, 208], [297, 210]], [[304, 278], [289, 278]], o);
  }
  function sentado(o) {
    return P([290, 124], [290, 152], [290, 214],
      [[318, 186], [314, 184]], [[324, 218], [318, 216]],
      [[350, 252], [354, 254]], [[388, 278], [394, 278]], o);
  }
  function supino(o) {
    return P([176, 228], [212, 236], [320, 234],
      [[212, 196], [216, 194]], [[252, 182], [258, 180]],
      [[374, 262], [380, 264]], [[424, 278], [430, 278]],
      combina({ g: .78, rot: -90, forca: 1 }, o));
  }
  function prono(o) {
    return P([176, 228], [212, 236], [320, 234],
      [[206, 208], [210, 206]], [[152, 192], [156, 194]],
      [[376, 200], [382, 202]], [[344, 176], [350, 178]],
      combina({ g: .78, rot: 92, view: 'back' }, o));
  }
  function pranchando(o) {
    return P([400, 190], [368, 200], [258, 238],
      [[400, 250], [404, 252]], [[440, 266], [444, 266]],
      [[206, 252], [202, 254]], [[152, 270], [146, 272]],
      combina({ g: .8, rot: 34, eq: EQ.flexao }, o));
  }

  /* --------------------------------------------------------------------
     CATÁLOGO DE POSES — um por exercício
     -------------------------------------------------------------------- */
  var POSES = {};

  function reg(chaves, pose) {
    for (var i = 0; i < chaves.length; i++) POSES[chave(chaves[i])] = pose;
  }

  /* ===== PEITO ===== */
  reg(['supino reto', 'supino reto com barra', 'supino reto com halteres', 'supino horizontal'],
    supino({ eq: EQ.supinoBarra }));
  reg(['supino inclinado', 'supino inclinado com halteres', 'supino inclinado com barra'],
    P([222, 130], [250, 168], [318, 212],
      [[266, 150], [278, 154]], [[286, 104], [300, 108]],
      [[368, 252], [374, 254]], [[412, 278], [418, 278]],
      { g: .9, rot: -18, eq: EQ.supinoInclHalter, forca: 1 }));
  reg(['supino inclinado com barra'],
    P([222, 130], [250, 168], [318, 212],
      [[264, 152], [276, 156]], [[288, 108], [294, 108]],
      [[368, 252], [374, 254]], [[412, 278], [418, 278]],
      { g: .9, rot: -18, eq: EQ.supinoIncl, forca: 1 }));
  reg(['supino declinado'],
    P([196, 244], [232, 240], [326, 222],
      [[222, 200], [226, 198]], [[258, 186], [264, 184]],
      [[380, 250], [386, 248]], [[420, 278], [426, 276]],
      { g: .76, rot: -74, eq: EQ.declinado, forca: 1 }));
  reg(['supino fechado'], supino({
    el: [[218, 198], [222, 196]], ma: [[248, 186], [254, 184]], eq: EQ.supinoFechado }));
  reg(['crucifixo reto', 'fly com halteres', 'crucifixo maquina', 'fly maquina'],
    P([176, 228], [212, 236], [320, 234],
      [[204, 194], [208, 192]], [[248, 178], [254, 176]],
      [[374, 262], [380, 264]], [[424, 278], [430, 278]],
      { g: .78, rot: -90, eq: EQ.fly, forca: 1 }));
  reg(['crucifixo inclinado', 'fly inclinado'],
    P([222, 130], [250, 168], [318, 212],
      [[262, 152], [276, 156]], [[284, 126], [296, 122]],
      [[368, 252], [374, 254]], [[412, 278], [418, 278]],
      { g: .9, rot: -18, eq: EQ.fly, forca: 1 }));
  reg(['crossover na polia', 'voador na polia', 'crucifixo na polia'],
    emPe({ el: [[344, 128], [350, 124]], ma: [[364, 158], [370, 154]],
           eq: EQ.crossover, forca: 1 }));
  reg(['peck deck', 'voador', 'pec deck'],
    sentado({ el: [[344, 172], [348, 170]], ma: [[378, 156], [382, 154]],
              eq: EQ.crucifixoMaq, forca: 1 }));
  reg(['flexao de braco', 'flexao', 'flexao de maos'],
    P([402, 194], [372, 204], [262, 238],
      [[404, 244], [408, 246]], [[438, 266], [442, 266]],
      [[206, 252], [202, 254]], [[152, 270], [146, 272]],
      { g: .84, rot: 36, eq: EQ.flexao, forca: 1 }));

  /* ===== COSTAS ===== */
  reg(['puxada frontal', 'puxada na polia', 'puxada alta'],
    P([292, 118], [294, 146], [296, 212],
      [[326, 118], [332, 120]], [[352, 68], [358, 68]],
      [[352, 250], [356, 252]], [[390, 278], [396, 278]],
      { g: .95, eq: EQ.puxadaAlta, forca: 1 }));
  reg(['puxada atras'], P([292, 118], [294, 146], [296, 212],
      [[332, 120], [338, 122]], [[360, 72], [366, 72]],
      [[352, 250], [356, 252]], [[390, 278], [396, 278]],
      { g: .95, eq: EQ.puxadaAtras, forca: 1 }));
  reg(['puxada neutra'], P([292, 118], [294, 146], [296, 212],
      [[328, 120], [334, 122]], [[350, 76], [356, 76]],
      [[352, 250], [356, 252]], [[390, 278], [396, 278]],
      { g: .95, eq: EQ.puxadaNeutra, forca: 1 }));
  reg(['barra fixa', 'barra fixa reversa', 'pull up'],
    P([318, 104], [314, 128], [308, 190],
      [[316, 90], [320, 90]], [[318, 50], [324, 50]],
      [[344, 240], [348, 242]], [[352, 268], [356, 270]],
      { g: .95, rot: -10, eq: EQ.barraFixa, forca: 1 }));
  reg(['remada baixa', 'remada na polia'],
    sentado({ el: [[340, 190], [344, 192]], ma: [[374, 172], [378, 174]],
              eq: EQ.remadaBaixa, forca: 1 }));
  reg(['remada curvada', 'remada curvada com barra', 'remada com barra'],
    P([380, 184], [350, 192], [268, 170],
      [[334, 160], [338, 162]], [[306, 178], [312, 178]],
      [[252, 222], [256, 224]], [[240, 278], [246, 278]],
      { g: .95, rot: -68, eq: EQ.remadaCurvada, forca: 1 }));
  reg(['remada unilateral', 'remada unilateral com halter'],
    P([368, 180], [344, 188], [268, 168],
      [[332, 158], [336, 160]], [[300, 172], [306, 172]],
      [[254, 222], [258, 224]], [[242, 278], [248, 278]],
      { g: .95, rot: -72, eq: EQ.remadaUnilateral, forca: 1 }));
  reg(['remada articulada'],
    sentado({ el: [[344, 172], [348, 174]], ma: [[378, 178], [382, 180]],
              eq: EQ.remadaArticulada, forca: 1 }));
  reg(['pullover na polia', 'pullover'], supino({
    el: [[176, 208], [180, 206]], ma: [[136, 194], [140, 192]], eq: EQ.pullover }));
  reg(['levantamento terra', 'terra'], emPe({
    el: [[314, 138], [318, 138]], ma: [[322, 174], [326, 174]],
    eq: EQ.terra, forca: 1 }));
  reg(['levandamento terra', 'levantamento terra romeno', 'stiff com barra', 'stiff', 'romeno'],
    P([270, 158], [348, 188], [268, 166],
      [[320, 194], [324, 196]], [[296, 206], [302, 206]],
      [[256, 222], [260, 224]], [[246, 278], [252, 278]],
      { g: .95, rot: -72, eq: EQ.stiff, forca: 1 }));
  reg(['stiff com halteres'],
    P([270, 158], [348, 188], [268, 166],
      [[322, 196], [326, 198]], [[298, 210], [306, 210]],
      [[256, 222], [260, 224]], [[246, 278], [252, 278]],
      { g: .95, rot: -72, eq: EQ.stiffHalter, forca: 1 }));
  reg(['remada alta'], emPe({
    el: [[348, 126], [354, 128]], ma: [[330, 104], [336, 104]],
    eq: EQ.remadaAlta, forca: 1 }));
  reg(['crucifixo inverso', 'elevacao frontal'], P([368, 180], [344, 188], [266, 168],
      [[330, 186], [334, 188]], [[288, 176], [294, 176]],
      [[252, 222], [256, 224]], [[240, 278], [246, 278]],
      { g: .95, rot: -72, eq: EQ.crucifixoInverso, forca: 1 }));

  /* ===== OMBROS ===== */
  reg(['desenvolvimento com halteres', 'desenvolvimento sentado', 'desenvolvimento'],
    P([300, 120], [300, 148], [300, 214],
      [[328, 118], [334, 120]], [[312, 82], [318, 82]],
      [[356, 252], [360, 254]], [[392, 278], [398, 278]],
      { g: .98, eq: EQ.desenvHalter, forca: 1 }));
  reg(['desenvolvimento com barra'],
    P([300, 120], [300, 148], [300, 214],
      [[330, 120], [336, 122]], [[312, 78], [318, 78]],
      [[356, 252], [360, 254]], [[392, 278], [398, 278]],
      { g: .98, eq: EQ.desenvBarra, forca: 1 }));
  reg(['desenvolvimento militar'],
    emPe({ el: [[330, 112], [336, 114]], ma: [[322, 108], [326, 108]],
           eq: EQ.barraRosca, forca: 1 }));
  reg(['desenvolvimento na maquina'],
    sentado({ el: [[344, 172], [348, 174]], ma: [[374, 150], [378, 150]],
              eq: EQ.desenvMaq, forca: 1 }));
  reg(['elevacao lateral'], emPe({
    el: [[332, 100], [336, 100]], ma: [[358, 104], [362, 104]],
    eq: EQ.lateral, forca: 1 }));
  reg(['elevacao lateral na polia'], emPe({
    el: [[334, 100], [338, 100]], ma: [[358, 104], [362, 104]],
    eq: EQ.lateralPolia, forca: 1 }));
  reg(['elevacao frontal'], emPe({
    el: [[332, 100], [336, 100]], ma: [[356, 100], [360, 100]],
    eq: EQ.lateral, forca: 1 }));
  reg(['face pull'], emPe({
    el: [[346, 130], [352, 132]], ma: [[358, 96], [364, 98]],
    eq: EQ.facePull, forca: 1 }));

  /* ===== BÍCEPS ===== */
  reg(['rosca direta', 'rosca direta com barra', 'rosca com barra', 'rosca reta', 'rosca inversa'],
    emPe({ el: [[318, 138], [322, 138]], ma: [[324, 114], [328, 114]],
           eq: EQ.barraRosca, forca: 1 }));
  reg(['rosca alternada com halteres', 'rosca com halteres', 'rosca martelo'],
    emPe({ el: [[318, 138], [322, 138]], ma: [[324, 112], [328, 112]],
           eq: EQ.halterPar, forca: 1 }));
  reg(['rosca scott', 'rosca no scott'], sentado({
    el: [[344, 182], [348, 184]], ma: [[358, 140], [362, 140]],
    eq: EQ.scott, forca: 1 }));
  reg(['rosca concentrada'], P([252, 122], [272, 152], [292, 212],
      [[324, 186], [306, 190]], [[330, 140], [296, 156]],
      [[352, 252], [356, 254]], [[392, 278], [398, 278]],
      { g: .95, rot: -16, eq: EQ.roscaIncl, forca: 1 }));
  reg(['rosca no banco inclinado', 'rosca inclinada'], P([244, 122], [264, 152], [288, 212],
      [[322, 190], [308, 192]], [[330, 146], [300, 160]],
      [[350, 252], [354, 254]], [[390, 278], [396, 278]],
      { g: .95, rot: -16, eq: EQ.roscaIncl, forca: 1 }));
  reg(['rosca na polia', 'rosca na maquina'], emPe({
    el: [[320, 140], [324, 140]], ma: [[326, 114], [330, 114]],
    eq: EQ.roscaPolia, forca: 1 }));

  /* ===== TRÍCEPS ===== */
  reg(['triceps pulley', 'triceps na polia', 'triceps polia'], emPe({
    el: [[322, 136], [326, 136]], ma: [[334, 156], [338, 156]],
    eq: EQ.tricepsPolia, forca: 1 }));
  reg(['triceps na polia unilateral', 'triceps unilateral na polia'], emPe({
    el: [[322, 136], [318, 142]], ma: [[334, 158], [288, 186]],
    eq: EQ.tricepsPolia, forca: 1 }));
  reg(['triceps corda'], emPe({
    el: [[322, 136], [326, 136]], ma: [[334, 156], [338, 156]],
    eq: EQ.cordaPolia, forca: 1 }));
  reg(['triceps testa', 'triceps coice'], supino({
    el: [[272, 212], [276, 212]], ma: [[244, 194], [248, 192]], eq: EQ.tricepsTesta }));
  reg(['triceps frances', 'triceps france'], supino({
    el: [[244, 200], [248, 198]], ma: [[258, 174], [264, 172]], eq: EQ.frances }));
  reg(['mergulho nas paralelas', 'mergulho', 'dip'],
    P([320, 116], [312, 148], [304, 214],
      [[318, 180], [322, 182]], [[358, 208], [364, 214]],
      [[300, 252], [304, 254]], [[286, 268], [282, 270]],
      { g: .95, eq: EQ.paralelas, forca: 1 }));
  reg(['mergulho no banco', 'triceps no banco'], P([318, 130], [312, 158], [302, 214],
      [[316, 190], [320, 192]], [[268, 216], [264, 218]],
      [[330, 250], [334, 252]], [[360, 278], [366, 278]],
      { g: .95, rot: 6, eq: EQ.mergulhoBanco, forca: 1 }));

  /* ===== QUADRÍCEPS / PERNAS ===== */
  reg(['agachamento livre', 'agachamento', 'squats'],
    P([300, 92], [300, 116], [298, 180],
      [[272, 136], [278, 138]], [[282, 104], [288, 104]],
      [[280, 216], [322, 218]], [[272, 278], [328, 278]],
      { g: 1.05, eq: EQ.agachamento, forca: 1 }));
  reg(['agachamento no smith', 'gluteo no smith'],
    P([300, 92], [300, 116], [298, 180],
      [[272, 136], [278, 138]], [[282, 104], [288, 104]],
      [[280, 216], [322, 218]], [[272, 278], [328, 278]],
      { g: 1.05, eq: EQ.smith, forca: 1 }));
  reg(['agachamento sumo'],
    P([300, 92], [300, 116], [298, 182],
      [[272, 136], [278, 138]], [[282, 104], [288, 104]],
      [[262, 220], [338, 222]], [[240, 278], [364, 278]],
      { g: 1.05, eq: EQ.agachamento, forca: 1 }));
  reg(['hack squat'], P([300, 96], [302, 120], [300, 180],
      [[284, 142], [290, 144]], [[292, 112], [298, 112]],
      [[282, 218], [324, 220]], [[274, 278], [330, 278]],
      { g: 1.05, eq: EQ.hack, forca: 1 }));
  reg(['leg press 45', 'leg press', 'leg press 45 graus', 'pressao de pernas'],
    P([204, 148], [216, 176], [228, 232],
      [[258, 200], [262, 202]], [[276, 216], [280, 218]],
      [[306, 208], [312, 206]], [[392, 152], [398, 150]],
      { g: .92, rot: -46, eq: EQ.legPress, forca: 1 }));
  reg(['cadeira extensora', 'extensora', 'extensao de pernas'],
    P([292, 122], [292, 150], [292, 214],
      [[318, 192], [322, 194]], [[318, 214], [322, 216]],
      [[354, 208], [358, 210]], [[374, 138], [378, 140]],
      { g: .95, eq: EQ.extensora, forca: 1 }));
  reg(['afundo', 'afundo com halteres', 'lunge'],
    P([302, 92], [300, 116], [292, 172],
      [[326, 142], [332, 144]], [[330, 168], [336, 170]],
      [[340, 216], [256, 226]], [[356, 278], [214, 278]],
      { g: 1.02, eq: EQ.stiffHalter, forca: 1 }));
  reg(['afundo bulgaro'],
    P([302, 92], [300, 116], [292, 172],
      [[326, 142], [332, 144]], [[330, 168], [336, 170]],
      [[340, 216], [248, 230]], [[356, 278], [196, 262]],
      { g: 1.02, eq: EQ.caixa, forca: 1 }));
  reg(['passada', 'passada com halteres'],
    P([300, 92], [298, 116], [290, 172],
      [[326, 142], [332, 144]], [[330, 168], [336, 170]],
      [[332, 214], [254, 224]], [[348, 278], [212, 278]],
      { g: 1.02, eq: EQ.stiffHalter, forca: 1 }));

  /* ===== POSTERIOR ===== */
  reg(['mesa flexora', 'flexao de pernas deitada'],
    prono({ el: [[196, 206], [200, 204]], ma: [[146, 190], [150, 192]], eq: EQ.mesaFlexora }));
  reg(['cadeira flexora', 'flexora'],
    sentado({ el: [[330, 196], [334, 198]], ma: [[324, 220], [318, 222]],
              jo: [[356, 224], [360, 226]], pe: [[342, 254], [346, 256]],
              eq: EQ.cadeiraFlexora, forca: 1 }));

  /* ===== GLÚTEOS ===== */
  reg(['elevacao pelvica', 'hip thrust'],
    P([194, 234], [230, 242], [336, 206],
      [[262, 216], [266, 216]], [[312, 200], [316, 200]],
      [[392, 246], [398, 248]], [[428, 278], [434, 278]],
      { g: .82, rot: -78, eq: EQ.hipThrust, forca: 1 }));
  reg(['coice na polia', 'coice', 'kickback'],
    P([370, 178], [346, 186], [268, 166],
      [[322, 196], [326, 198]], [[270, 186], [276, 186]],
      [[256, 222], [260, 224]], [[246, 278], [252, 278]],
      { g: .95, rot: -72, eq: EQ.coicePolia, forca: 1 }));
  reg(['abducao de quadril na maquina', 'abducao na maquina'],
    sentado({ el: [[330, 190], [334, 192]], ma: [[324, 214], [320, 216]],
              jo: [[358, 198], [316, 206]], pe: [[396, 166], [340, 196]],
              eq: EQ.abducao, forca: 1 }));
  reg(['abducao de quadril com elastico', 'abducao com elastico', 'abducao'], emPe({
    el: [[318, 142], [322, 142]], ma: [[322, 178], [326, 178]],
    jo: [[282, 210], [324, 212]], pe: [[272, 278], [338, 278]],
    eq: EQ.bandaQuadril }));

  /* ===== PANTURRILHA ===== */
  reg(['panturrilha em pe'], emPe({
    el: [[314, 126], [318, 126]], ma: [[312, 158], [316, 158]],
    jo: [[298, 208], [322, 210]], pe: [[292, 268], [328, 266]],
    eq: EQ.panturrilha, forca: 1 }));
  reg(['panturrilha no leg press'],
    P([204, 148], [216, 176], [228, 232],
      [[258, 200], [262, 202]], [[276, 216], [280, 218]],
      [[306, 208], [312, 206]], [[392, 158], [398, 156]],
      { g: .92, rot: -46, eq: EQ.legPress, forca: 1 }));
  reg(['panturrilha sentado'], sentado({
    el: [[318, 190], [322, 192]], ma: [[318, 212], [322, 214]],
    jo: [[350, 218], [354, 220]], pe: [[356, 272], [360, 274]],
    eq: EQ.panturrilhaSent, forca: 1 }));
  reg(['panturrilha unilateral'],
    P([302, 94], [300, 118], [298, 172],
      [[324, 144], [328, 146]], [[326, 176], [330, 178]],
      [[300, 208], [336, 212]], [[304, 262], [344, 268]],
      { g: 1, eq: EQ.panturrilha, forca: 1 }));

  /* ===== CORE ===== */
  reg(['abdominal supra', 'crunch abdominal', 'abdominal', 'crunch'],
    P([196, 220], [230, 240], [326, 238],
      [[186, 210], [190, 208]], [[208, 202], [214, 204]],
      [[378, 224], [382, 226]], [[418, 264], [424, 264]],
      { g: .8, rot: -66, eq: EQ.tapete, forca: 1 }));
  reg(['abdominal infra'],
    P([196, 240], [230, 250], [326, 248],
      [[268, 262], [272, 264]], [[286, 266], [290, 266]],
      [[374, 208], [378, 210]], [[430, 162], [436, 164]],
      { g: .8, rot: -84, eq: EQ.tapete, forca: 1 }));
  reg(['elevacao de pernas', 'leg raise', 'elevacao de pernas', 'pernas para cima'],
    P([196, 238], [230, 248], [326, 246],
      [[268, 260], [272, 262]], [[286, 264], [290, 264]],
      [[372, 204], [376, 206]], [[428, 156], [434, 158]],
      { g: .8, rot: -84, eq: EQ.tapete, forca: 1 }));
  reg(['abdominal bicicleta'],
    P([198, 226], [232, 244], [326, 240],
      [[190, 216], [194, 214]], [[212, 208], [218, 210]],
      [[372, 216], [322, 232]], [[412, 250], [346, 262]],
      { g: .8, rot: -62, eq: EQ.tapete, forca: 1 }));
  reg(['abdominal obliquo'],
    P([198, 222], [232, 244], [326, 242],
      [[218, 210], [222, 212]], [[250, 206], [256, 208]],
      [[372, 222], [330, 236]], [[414, 254], [352, 262]],
      { g: .8, rot: -60, eq: EQ.tapete, forca: 1 }));
  reg(['prancha abdominal', 'prancha'], pranchando());
  reg(['prancha lateral'],
    P([404, 214], [370, 228], [258, 252],
      [[386, 262], [390, 264]], [[430, 278], [434, 278]],
      [[214, 258], [210, 260]], [[160, 274], [154, 276]],
      { g: .84, rot: 52, view: 'front', eq: EQ.flexao, forca: 1 }));
  reg(['abdominal na maquina'],
    sentado({ el: [[330, 186], [334, 188]], ma: [[368, 168], [372, 170]],
              eq: EQ.abdominalMaquina, forca: 1 }));
  reg(['abdominal na polia', 'abdominal na corda'],
    P([240, 226], [268, 240], [330, 268],
      [[300, 246], [304, 248]], [[344, 214], [348, 216]],
      [[388, 274], [392, 276]], [[424, 272], [428, 274]],
      { g: .82, rot: -40, eq: EQ.abdominalPolia, forca: 1 }));

  /* ===== CARDIO / FUNCIONAL ===== */
  reg(['mountain climber', 'mountain climbers', 'escalador'], P([402, 186], [372, 196], [258, 236],
      [[406, 244], [410, 246]], [[440, 264], [444, 264]],
      [[206, 252], [318, 230]], [[152, 270], [346, 262]],
      { g: .84, rot: 34, eq: EQ.flexao, forca: 1 }));
  reg(['burpee'], P([300, 66], [300, 92], [300, 150],
      [[298, 66], [302, 66]], [[296, 38], [304, 38]],
      [[294, 204], [306, 206]], [[286, 274], [314, 276]],
      { g: 1, eq: EQ.semEquip, forca: 1 }));
  reg(['polichinelo', 'jumping jack'], P([300, 74], [300, 98], [300, 156],
      [[330, 84], [334, 84]], [[360, 66], [364, 66]],
      [[278, 208], [326, 210]], [[252, 272], [352, 274]],
      { g: 1, eq: EQ.semEquip }));
  reg(['pular corda', 'corda de pular', 'skipping'], P([300, 76], [300, 100], [300, 156],
      [[330, 132], [334, 132]], [[338, 108], [342, 108]],
      [[292, 210], [308, 212]], [[284, 270], [316, 272]],
      { g: 1, eq: EQ.cordaPular, forca: 1 }));
  reg(['funcional', 'treino funcional', 'circuito'], emPe({ forca: 1 }));

  /* --------------------------------------------------------------------
     FALLBACK POR GRUPO — garante que NENHUM exercício fique sem imagem
     -------------------------------------------------------------------- */
  var FALLBACK = {
    'Peito': function () { return supino({ eq: EQ.supinoBarra }); },
    'Costas': function () { return P([292, 118], [294, 146], [296, 212],
      [[330, 120], [336, 122]], [[356, 70], [362, 70]],
      [[352, 250], [356, 252]], [[390, 278], [396, 278]],
      { g: .95, eq: EQ.puxadaAlta, forca: 1 }); },
    'Ombros': function () { return emPe({ el: [[330, 100], [334, 100]],
      ma: [[356, 104], [360, 104]], eq: EQ.lateral, forca: 1 }); },
    'Bíceps': function () { return emPe({ el: [[318, 138], [322, 138]],
      ma: [[324, 114], [328, 114]], eq: EQ.barraRosca, forca: 1 }); },
    'Tríceps': function () { return emPe({ el: [[322, 136], [326, 136]],
      ma: [[334, 156], [338, 156]], eq: EQ.tricepsPolia, forca: 1 }); },
    'Quadríceps': function () { return P([300, 92], [300, 116], [298, 180],
      [[272, 136], [278, 138]], [[282, 104], [288, 104]],
      [[280, 216], [322, 218]], [[272, 278], [328, 278]],
      { g: 1.05, eq: EQ.agachamento, forca: 1 }); },
    'Pernas': function () { return P([300, 92], [300, 116], [298, 180],
      [[272, 136], [278, 138]], [[282, 104], [288, 104]],
      [[280, 216], [322, 218]], [[272, 278], [328, 278]],
      { g: 1.05, eq: EQ.agachamento, forca: 1 }); },
    'Posterior': function () { return P([270, 158], [348, 188], [268, 166],
      [[320, 194], [324, 196]], [[296, 206], [302, 206]],
      [[256, 222], [260, 224]], [[246, 278], [252, 278]],
      { g: .95, rot: -72, eq: EQ.stiff, forca: 1 }); },
    'Glúteos': function () { return P([194, 234], [230, 242], [336, 206],
      [[262, 216], [266, 216]], [[312, 200], [316, 200]],
      [[392, 246], [398, 248]], [[428, 278], [434, 278]],
      { g: .82, rot: -78, eq: EQ.hipThrust, forca: 1 }); },
    'Panturrilha': function () { return emPe({ el: [[314, 126], [318, 126]],
      ma: [[312, 158], [316, 158]], jo: [[298, 208], [322, 210]],
      pe: [[292, 268], [328, 266]], eq: EQ.panturrilha, forca: 1 }); },
    'Core': function () { return P([196, 220], [230, 240], [326, 238],
      [[186, 210], [190, 208]], [[208, 202], [214, 204]],
      [[378, 224], [382, 226]], [[418, 264], [424, 264]],
      { g: .8, rot: -66, eq: EQ.tapete, forca: 1 }); },
    'Cardio': function () { return P([300, 74], [300, 98], [300, 156],
      [[330, 84], [334, 84]], [[360, 66], [364, 66]],
      [[278, 208], [326, 210]], [[252, 272], [352, 274]],
      { g: 1, eq: EQ.semEquip }); },
    'Funcional': function () { return emPe({ forca: 1 }); }
  };

  /* Lista ordenada do mais específico para o mais genérico. */
  var CHAVES = (function () {
    var l = [], k;
    for (k in POSES) if (Object.prototype.hasOwnProperty.call(POSES, k)) l.push(k);
    l.sort(function (a, b) { return b.length - a.length; });
    return l;
  })();

  function acharPose(nome, grupo) {
    var n = chave(nome), i, k;
    if (POSES[n]) return POSES[n];

    // sem os parênteses: "peck deck (voador)" -> "peck deck"
    var semParen = n.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
    if (semParen && POSES[semParen]) return POSES[semParen];

    // correspondência por palavra-chave (a mais longa vence)
    for (i = 0; i < CHAVES.length; i++) {
      k = CHAVES[i];
      if (k.length > n.length) continue;
      if (n.indexOf(k) >= 0) return POSES[k];
    }
    // por último: o exercício mais parecido dentro do mesmo grupo
    if (FALLBACK[grupo]) return FALLBACK[grupo]();
    return emPe({ forca: 1 });
  }

  /* --------------------------------------------------------------------
     RENDER FINAL
     -------------------------------------------------------------------- */
  var TIPOS = ['curto', 'curto', 'coque', 'rabo', 'mochila'];
  var CACHE = {};

  function paleta(ex) {
    var nome = (ex && ex.nome) || 'Exercicio';
    var grupo = (ex && ex.grupo) || 'default';
    var s = hash(chave(nome) + '|' + chave(grupo));
    var pose = acharPose(nome, grupo);
    var c = {
      grupo: grupo,
      pele: escolher(PELES, s >>> 0),
      roupa: escolher(ROUPAS, s >>> 3),
      cabelo: escolher(CABELOS, s >>> 6),
      tenis: escolher(TENIS_COR, s >>> 9),
      dir: pose.dir, rot: pose.rot, view: pose.view,
      forca: pose.forca, tipo: TIPOS[(s >>> 0) % 5]
    };
    return { s: s, pose: pose, c: c };
  }

  function svg(ex) {
    var r = paleta(ex);
    var pose = r.pose, c = r.c;
    var eq = pose.eq ? pose.eq(c, pose) : null;
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H +
              '" width="' + W + '" height="' + H + '">';
    out += cenario(c, r.s);
    if (eq && eq.b) out += eq.b;
    out += personagem(pose, c);
    if (eq && eq.f) out += eq.f;
    out += esforco(r.s, pose.forca ? 3 : (pose.eq === EQ.semEquip ? 2 : 0));
    out += vinheta();
    out += '</svg>';
    return out;
  }

  function dataUri(ex) {
    var e = ex || { nome: 'Exercicio', grupo: 'default' };
    var k = chave(e.nome) + '|' + chave(e.grupo);
    if (CACHE[k]) return CACHE[k];
    var uri;
    try {
      uri = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg(e));
    } catch (err) {
      uri = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg({ nome: 'Exercicio', grupo: 'Forca' }));
    }
    CACHE[k] = uri;
    return uri;
  }

  /* API pública (app.js usa window.TreinoFacilIlus.dataUri) */
  global.TreinoFacilIlus = {
    dataUri: dataUri,
    svg: svg,
    temPose: function (nome) { return !!POSES[chave(nome)]; }
  };
})(typeof window !== 'undefined' ? window
   : (typeof globalThis !== 'undefined' ? globalThis : this));
