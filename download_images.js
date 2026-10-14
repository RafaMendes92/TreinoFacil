const fs = require('fs');
const path = require('path');
const map = require('./pt_en_map.js');
const exs = JSON.parse(fs.readFileSync('en_full.json', 'utf8'));

const slug = s => s.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

const norm = s => (s || '').toLowerCase().trim();

const OUT = path.join('images', 'real');
fs.mkdirSync(OUT, { recursive: true });

const real = {};
const tasks = [];
for (const [pt, en] of Object.entries(map)) {
  const ex = exs.find(e => e.name === en);
  if (!ex) { console.log('N/EN', pt); continue; }
  const slugEx = ex.id; // folder id like Barbell_Bench_Press_-_Medium_Grip
  const imgPath = path.join(OUT, slug(pt) + '.jpg');
  real[norm(pt)] = 'images/real/' + slug(pt) + '.jpg';
  const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + ex.images[0];
  tasks.push(
    fetch(url).then(r => r.arrayBuffer()).then(buf => {
      fs.writeFileSync(imgPath, Buffer.from(buf));
      console.log('OK', pt, '->', imgPath, fs.statSync(imgPath).size);
    }).catch(e => console.log('ERR', pt, e.message))
  );
}
Promise.all(tasks).then(() => {
  fs.writeFileSync('real.js', 'const IMG_REAL = ' + JSON.stringify(real, null, 1) + ';\n');
  console.log('real.js criado com', Object.keys(real).length, 'exercícios');
});
