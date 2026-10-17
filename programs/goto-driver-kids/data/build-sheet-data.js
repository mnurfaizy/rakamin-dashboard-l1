// Builds the dashboard sheet tables from responses.js + themes.js and checks them.
// Usage (from this folder): node data/build-sheet-data.js  ->  writes data/sheet-data.json (feedback, info, insight)
const fs = require('fs');
const path = require('path');
const R = require('./responses');
const T = require('./themes');

const DATE = { d2: 'Selasa, 29 September 2026', d3: 'Rabu, 30 September 2026' };
const TOPIK = { d2: 'Think Like A Professional', d3: 'Make Your Thinking Visible' };
const PESERTA = 27;
const ITEMS = ['Lingkungan belajar selama training mendukung proses belajar saya.', 'Lingkungan belajar mendorong saya untuk aktif terlibat selama training.', 'Saya puas dengan perangkat dukungan (support tools) yang disediakan pada sesi ini.', 'Materi pada sesi ini terstruktur dengan baik.', 'Materi training ini relevan dengan peran dan kebutuhan saya.', 'Training ini membantu saya mempersiapkan diri untuk tahap selanjutnya / magang.', 'Saya yakin dapat menerapkan apa yang saya pelajari saat magang / bekerja.', 'Saya dapat menerapkan atau membagikan apa yang saya pelajari ke rekan lain.', 'Cara penyampaian Trainer/Pembicara jelas dan mudah dipahami.', 'Trainer menyampaikan materi dengan cara yang menarik.', 'Asisten Tutor membantu saya dengan baik ketika saya membutuhkan bantuan selama training.', 'Training ini sesuai dengan harapan saya.', 'Secara keseluruhan, saya puas dengan sesi ini.'];
const NPS = 'Seberapa besar kemungkinan Anda akan merekomendasikan sesi ini kepada orang lain?';
const TEXTS = ['Apa bagian yang paling bermanfaat dari training ini dan harus dipertahankan di masa mendatang?', 'Perubahan atau perbaikan apa yang Anda sarankan untuk Trainer, Materi, atau pelaksanaan program ke depannya?'];
const FIELD = { baik: 14, saran: 15 };
const PANEL = { baik: 'Diapresiasi', saran: 'Saran perbaikan' };
const BATCH = { d2: '2', d3: '3' };
const id = (b, n) => `D${BATCH[b]}-${n}`;

// Majority voice: Diapresiasi themes voiced by >= 30% of respondents; when none reaches that, the
// most-voiced theme(s) of the view (ties included). 30% is a guide, not a hard cut (user decision).
function majority(themes, n) {
  const strong = themes.filter(t => t.count / n >= 0.3);
  if (strong.length) return strong;
  const top = Math.max(...themes.map(t => t.count));
  return themes.filter(t => t.count === top);
}
const errors = [];
const feedback = [['Day', 'Tanggal', 'Responden', ...ITEMS, NPS, ...TEXTS]];
for (const b of ['d2', 'd3']) R[b].forEach((r, i) => feedback.push([BATCH[b], DATE[b], id(b, i + 1), ...r.map(String)]));

const answer = (b, n, f) => { const r = R[b][n - 1]; if (!r) errors.push(`${b} #${n} tidak ada`); return r ? r[FIELD[f]] : ''; };
const insight = [['Day', 'Panel', 'Tema', 'Jumlah', 'Responden', 'Kutipan', 'Kata Kunci']];

function quoteRow(batchLabel, n, theme, b, num, text) {
  if (!answer(b, num, 'baik').includes(text)) errors.push(`Quote tidak persis: ${b} #${num} "${text}"`);
  return [batchLabel, 'Suara Mayoritas', `${theme.tema} (${theme.count} dari ${n} responden)`, '', id(b, num), text, ''];
}

for (const b of ['d2', 'd3']) {
  const n = R[b].length;
  for (const [f, themes] of Object.entries(T[b])) {
    for (const t of themes) {
      t.count = t.rows.length;
      if (new Set(t.rows).size !== t.rows.length) errors.push(`Duplikat baris: ${b} ${t.tema}`);
      const kutipan = t.rows.slice(0, 2).map(x => answer(b, x, f).replace(/\s+/g, ' ').trim()).join(' | ');
      insight.push([BATCH[b], PANEL[f], t.tema, t.count, t.rows.map(x => id(b, x)).join('|'), kutipan, t.kunci.join('|')]);
    }
  }
  // Suara Mayoritas: Diapresiasi themes voiced by at least 30% of respondents.
  const chosen = majority(T[b].baik, n);
  chosen.forEach(t => {
    if (!t.quote) { errors.push(`Tema mayoritas tanpa quote: ${b} ${t.tema}`); return; }
    if (!t.rows.includes(t.quote[0])) errors.push(`Quote bukan dari tema: ${b} ${t.tema}`);
    insight.push(quoteRow(BATCH[b], n, t, b, t.quote[0], t.quote[1]));
  });
  T[b].baik.filter(t => t.quote && !chosen.includes(t)).forEach(t => errors.push(`Quote untuk tema yang bukan mayoritas: ${b} ${t.tema}`));
}

const nAll = R.d2.length + R.d3.length;
for (const [f, themes] of Object.entries(T.rangkuman)) {
  for (const t of themes) {
    const ids = Object.entries(t.from).flatMap(([b, rows]) => rows.map(x => id(b, x)));
    t.count = ids.length;
    // Every rangkuman row must also be coded in the same panel for its own batch.
    for (const [b, rows] of Object.entries(t.from)) {
      const coded = new Set(T[b][f].flatMap(x => x.rows));
      rows.filter(x => !coded.has(x)).forEach(x => errors.push(`Rangkuman ${t.tema}: ${b} #${x} tidak dikoding di ${f}`));
    }
    const [b0, rows0] = Object.entries(t.from)[0];
    const kutipan = rows0.slice(0, 2).map(x => answer(b0, x, f).replace(/\s+/g, ' ').trim()).join(' | ');
    // Keywords come from the batch themes that sit (almost) entirely inside this summary theme;
    // when none does, from the batch theme that overlaps it the most.
    const sources = b => {
      const scored = T[b][f].map(x => { const hit = x.rows.filter(r => t.from[b].includes(r)).length; return { x, hit, share: hit / x.rows.length }; });
      const inside = scored.filter(s => s.share >= 0.75);
      return inside.length ? inside.map(s => s.x) : [scored.sort((p, q) => q.hit - p.hit)[0].x];
    };
    const kunci = t.kunci || [...new Set(Object.keys(t.from).flatMap(b => sources(b).flatMap(x => x.kunci)))];
    insight.push(['Rangkuman', PANEL[f], t.tema, t.count, ids.join('|'), kutipan, kunci.join('|')]);
  }
}
const chosenAll = majority(T.rangkuman.baik, nAll);
chosenAll.forEach(t => {
  const [b, num, text] = t.quote || [];
  if (!t.quote) { errors.push(`Rangkuman mayoritas tanpa quote: ${t.tema}`); return; }
  if (!t.from[b]?.includes(num)) errors.push(`Quote rangkuman bukan dari tema: ${t.tema}`);
  insight.push(quoteRow('Rangkuman', nAll, t, b, num, text));
});

const info = [['Day', 'Tanggal', 'Tutor', 'Asisten Tutor', 'Topik', 'Jumlah Peserta'],
  ['2', DATE.d2, 'Mas Caesar', 'Mba Fitri', TOPIK.d2, String(PESERTA)],
  ['3', DATE.d3, 'Mas Caesar', 'Mba Fitri', TOPIK.d3, String(PESERTA)]];

fs.writeFileSync(path.join(__dirname, 'sheet-data.json'), JSON.stringify({ feedback, info, insight }, null, 1));
console.log(`feedback ${feedback.length - 1} baris, insight ${insight.length - 1} baris`);
for (const r of insight.slice(1)) console.log(`${r[0].padEnd(9)} ${r[1].padEnd(16)} ${String(r[3]).padStart(2)}  ${r[2]}`);
if (errors.length) { console.error('\nMASALAH:\n' + errors.join('\n')); process.exit(1); }
