const fs = require('fs');
const jobs = [
  ['Supino Inclinado Máquina', 'Leverage_Incline_Chest_Press', 'supino_inclinado_maquina'],
  ['Supino Declinado Máquina', 'Leverage_Decline_Chest_Press', 'supino_declinado_maquina']
];
(async () => {
  for (const [pt, en, fn] of jobs) {
    const url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/' + en + '/0.jpg';
    const r = await fetch(url);
    const b = Buffer.from(await r.arrayBuffer());
    fs.writeFileSync('images\\real\\' + fn + '.jpg', b);
    console.log('OK', fn, b.length);
  }
  let rj = fs.readFileSync('real.js', 'utf8');
  if (!rj.includes('supino_inclinado_maquina')) {
    rj = rj.replace(
      '"supino máquina": "images/real/supino_maquina.jpg",',
      '"supino máquina": "images/real/supino_maquina.jpg",\n "supino inclinado máquina": "images/real/supino_inclinado_maquina.jpg",\n "supino declinado máquina": "images/real/supino_declinado_maquina.jpg",'
    );
    fs.writeFileSync('real.js', rj);
  }
  console.log('real.js updated:', rj.includes('supino_inclinado_maquina'));
})();
