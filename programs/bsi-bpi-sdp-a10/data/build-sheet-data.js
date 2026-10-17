// Builds the dashboard sheet tables from responses.js + themes.js and checks them.
// Usage (from this folder): node data/build-sheet-data.js  ->  writes data/sheet-data.json (feedback, info, insight)
const fs = require('fs');
const path = require('path');
const R = require('./responses');
const T = require('./themes');

const DATE = { h1: 'Senin, 14 September 2026', h2: 'Selasa, 15 September 2026' };
const ITEMS = ['Materi yang disampaikan jelas dan mudah dipahami', 'Materi yang diberikan relevan dan dapat diaplikasikan dalam pekerjaan saya', 'Tutor menguasai materi yang disampaikan', 'Tutor mampu menyampaikan materi dengan jelas dan sistematis', 'Tutor mampu menjawab pertanyaan peserta dengan baik', 'Tutor mampu membangun interaksi dan diskusi selama sesi training.', 'Asisten Tutor membantu saya dalam sesi pembelajaran', 'Bagaimana penilaian Bapak/Ibu terhadap struktur dan desain materi pelatihan ini?', 'Bagaimana penilaian Bapak/Ibu terhadap durasi dan format pelatihan ini?', 'Sejauh mana fasilitas yang disediakan (ruang pelatihan, teknologi, materi, dan fasilitas pendukung lainnya) mendukung kelancaran dan kenyamanan pelatihan?', 'Secara keseluruhan, saya merasa puas terhadap pelaksanaan training ini.'];
const NPS = 'Dari skala 1-10, sejauh mana Bapak/Ibu ingin merekomendasikan training ini kepada rekan kerja?';
const TEXTS = ['Apa saja hal yang menurut Bapak/Ibu sudah berjalan dengan baik dalam pelaksanaan training ini?', 'Saran dan masukan apa yang dapat Bapak/Ibu berikan untuk meningkatkan kualitas pelaksanaan training ke depannya?', 'Topik yang paling Anda ingat dari sesi yang diikuti adalah', 'Konten materi yang perlu diperdalam lagi adalah...'];
const FIELD = { baik: 12, saran: 13, diingat: 14, dalami: 15 };
const PANEL = { baik: 'Diapresiasi', saran: 'Saran perbaikan', dalami: 'Ingin diperdalam', diingat: 'Paling diingat' };
const BATCH = { h1: '1', h2: '2' };
const id = (b, n) => `H${BATCH[b]}-${n}`;

// Majority voice: Diapresiasi themes voiced by >= 30% of respondents; when none reaches that, the
// most-voiced theme(s) of the view (ties included). 30% is a guide, not a hard cut (user decision).
function majority(themes, n) {
  const strong = themes.filter(t => t.count / n >= 0.3);
  if (strong.length) return strong;
  const top = Math.max(...themes.map(t => t.count));
  return themes.filter(t => t.count === top);
}
const errors = [];
const feedback = [['Hari', 'Tanggal', 'Responden', ...ITEMS, NPS, ...TEXTS]];
for (const b of ['h1', 'h2']) R[b].forEach((r, i) => feedback.push([BATCH[b], DATE[b], id(b, i + 1), ...r.map(String)]));

const answer = (b, n, f) => { const r = R[b][n - 1]; if (!r) errors.push(`${b} #${n} tidak ada`); return r ? r[FIELD[f]] : ''; };
const insight = [['Hari', 'Panel', 'Tema', 'Jumlah', 'Responden', 'Kutipan', 'Kata Kunci']];

function quoteRow(batchLabel, n, theme, b, num, text) {
  if (!answer(b, num, 'baik').includes(text)) errors.push(`Quote tidak persis: ${b} #${num} "${text}"`);
  return [batchLabel, 'Suara Mayoritas', `${theme.tema} (${theme.count} dari ${n} responden)`, '', id(b, num), text, ''];
}

for (const b of ['h1', 'h2']) {
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

const nAll = R.h1.length + R.h2.length;
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
    const kunci = [...new Set(Object.keys(t.from).flatMap(b => sources(b).flatMap(x => x.kunci)))];
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

const info = [['Hari', 'Tanggal', 'Tutor', 'Asisten Tutor', 'Topik', 'Jumlah Peserta'],
  ['1', DATE.h1, 'Nia', 'Dias', 'Business Process Improvement for SDP', '29'],
  ['2', DATE.h2, 'Nia', 'Dias', 'Business Process Improvement for SDP', '29']];

fs.writeFileSync(path.join(__dirname, 'sheet-data.json'), JSON.stringify({ feedback, info, insight }, null, 1));
console.log(`feedback ${feedback.length - 1} baris, insight ${insight.length - 1} baris`);
for (const r of insight.slice(1)) console.log(`${r[0].padEnd(9)} ${r[1].padEnd(16)} ${String(r[3]).padStart(2)}  ${r[2]}`);
if (errors.length) { console.error('\nMASALAH:\n' + errors.join('\n')); process.exit(1); }
