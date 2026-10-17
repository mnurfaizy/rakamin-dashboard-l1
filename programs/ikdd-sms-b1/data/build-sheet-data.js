// Builds the dashboard sheet tables from responses.js + themes.js and checks them.
// Usage (from the program folder): node data/build-sheet-data.js  ->  writes data/sheet-data.json (feedback, info, insight)
const fs = require('fs');
const path = require('path');
const R = require('./responses');
const T = require('./themes');

const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PESERTA = 19;
const INFO = {
  1: ['Rabu, 15 Juli 2026', 'Yosef, Ulya', 'Fitri', 'Career Preparation, Social Media Landscape & Platform Features'],
  2: ['Kamis, 16 Juli 2026', 'Ulya', 'Fitri', 'Platform Exploration, Audience Behavior, Market Research & Persona'],
  3: ['Jumat, 17 Juli 2026', 'Ulya', 'Fitri', 'Personal Branding, Social Media Content Creation, How to Ideate'],
  4: ['Senin, 20 Juli 2026', 'Jumali', 'Fitri', 'How to Ideate (praktik), How to Translate The Brief, Visual Content dengan Canva'],
  5: ['Selasa, 21 Juli 2026', 'Habib', 'Prita', 'Growth Mindset, Copywriting, Introduction to Paid Social Media, Ads Setup'],
  6: ['Rabu, 22 Juli 2026', 'Habib', 'Fitri', 'Social Media Ads Setup (praktik), Ads Optimization, Social Media Metrics & KPIs'],
  7: ['Kamis, 23 Juli 2026', 'Jumali', 'Fitri', 'Reading Social Media Analytics, Strategy Development, Content Calendar & Campaign Planning'],
  8: ['Jumat, 24 Juli 2026', 'Jumali', 'Fitri', 'Social Media Battle Royale, Strategy Development (praktik), Leadership & Initiative'],
  9: ['Senin, 27 Juli 2026', 'Tim Mybest, Panji', 'Fitri', 'Social Media Management Tools (online), AI for Content Creation & Strategy, Materials Recap'],
  10: ['Selasa, 28 Juli 2026', 'Arfilanda', 'Fitri', 'Final Project Explanation, Project Management, Meet the Team'],
};
const ITEMS = ['Materi mudah dipahami', 'Alokasi waktu untuk materi ini telah sesuai', 'Tujuan pembelajaran terjawab dalam materi yang disampaikan', 'Metode yang digunakan sesuai dengan tujuan pembelajaran', 'Tutor menguasai materi yang diajarkan', 'Tutor dapat menjawab pertanyaan peserta dengan efektif', 'Tutor dapat menjaga minat belajar Saya', 'Asisten Tutor membantu saya dalam sesi pembelajaran', 'Seberapa puaskah kamu dengan sesi ini secara keseluruhan'];
const NPS = 'Dari skala 0 hingga 10, seberapa besar kamu akan merekomendasikan pelatihan ini?';
const TEXTS = ['Ceritakan kesan atau komentar kamu untuk keseluruhan sesi ini...', 'Seberapa membantu Tim Rakamin atau Asisten Tutor selama sesi pelatihan berlangsung? Ceritakan dong pengalaman kamu...', 'Bagian pada sesi training yang perlu diperbaiki, boleh dari segi materi, technicalities, atau lainnya...', 'Konten materi yang perlu diperdalam lagi adalah...'];
const FIELD = { baik: 10, saran: 12, dalami: 13 };
const PANEL = { baik: 'Diapresiasi', saran: 'Saran perbaikan', dalami: 'Ingin diperdalam' };
const id = (d, n) => `D${d}-${n}`;

const errors = [];
const feedback = [['Day', 'Tanggal', 'Responden', ...ITEMS, NPS, ...TEXTS]];
for (const d of DAYS) R[d].forEach((r, i) => feedback.push([String(d), INFO[d][0], id(d, i + 1), ...r.slice(0, 10).map(String), ...r.slice(10)]));

const answer = (d, n, f) => { const r = R[d][n - 1]; if (!r) errors.push(`D${d} #${n} tidak ada`); return r ? r[FIELD[f]] : ''; };
const insight = [['Day', 'Panel', 'Tema', 'Jumlah', 'Responden', 'Kutipan', 'Kata Kunci']];
const clean = s => String(s).replace(/\s+/g, ' ').trim();

function quoteRow(label, n, theme, d, num, text) {
  if (!answer(d, num, 'baik').includes(text)) errors.push(`Kutipan tidak persis: D${d} #${num} "${text}"`);
  if (text.length > 130) errors.push(`Kutipan terlalu panjang (${text.length}): ${text}`);
  return [label, 'Suara Mayoritas', `${theme.tema} (${theme.count} dari ${n} responden)`, '', id(d, num), text, ''];
}

for (const d of DAYS) {
  const n = R[d].length;
  for (const [f, themes] of Object.entries(T[d])) {
    for (const t of themes) {
      t.count = t.rows.length;
      if (new Set(t.rows).size !== t.rows.length) errors.push(`Duplikat baris: D${d} ${t.tema}`);
      t.rows.filter(x => x < 1 || x > n).forEach(x => errors.push(`D${d} ${t.tema}: nomor ${x} di luar 1..${n}`));
      const kutipan = t.rows.slice(0, 2).map(x => clean(answer(d, x, f))).join(' | ');
      insight.push([String(d), PANEL[f], t.tema, t.count, t.rows.map(x => id(d, x)).join('|'), kutipan, t.kunci.join('|')]);
    }
  }
  // Suara Mayoritas: Diapresiasi themes voiced by at least 30% of that day's respondents.
  T[d].baik.filter(t => t.count / n >= 0.3).forEach(t => {
    if (!t.quote) { errors.push(`Tema mayoritas tanpa kutipan: D${d} ${t.tema}`); return; }
    if (!t.rows.includes(t.quote[0])) errors.push(`Kutipan bukan dari tema: D${d} ${t.tema}`);
    insight.push(quoteRow(String(d), n, t, d, t.quote[0], t.quote[1]));
  });
  T[d].baik.filter(t => t.quote && t.count / n < 0.3).forEach(t => errors.push(`Kutipan untuk tema di bawah 30%: D${d} ${t.tema}`));
}

const nAll = DAYS.reduce((s, d) => s + R[d].length, 0);
for (const [f, themes] of Object.entries(T.rangkuman)) {
  for (const t of themes) {
    const ids = Object.entries(t.from).flatMap(([d, rows]) => rows.map(x => id(d, x)));
    t.count = ids.length;
    // Every Rangkuman row must also be coded in the same panel on its own day.
    for (const [d, rows] of Object.entries(t.from)) {
      const coded = new Set(T[d][f].flatMap(x => x.rows));
      rows.filter(x => !coded.has(x)).forEach(x => errors.push(`Rangkuman ${t.tema}: D${d} #${x} tidak dikoding di ${f}`));
    }
    const [d0, rows0] = Object.entries(t.from)[0];
    const kutipan = rows0.slice(0, 2).map(x => clean(answer(d0, x, f))).join(' | ');
    insight.push(['Rangkuman', PANEL[f], t.tema, t.count, ids.join('|'), kutipan, t.kunci.join('|')]);
  }
}
T.rangkuman.baik.filter(t => t.count / nAll >= 0.3).forEach(t => {
  if (!t.quote) { errors.push(`Rangkuman mayoritas tanpa kutipan: ${t.tema}`); return; }
  const [d, num, text] = t.quote;
  if (!t.from[d]?.includes(num)) errors.push(`Kutipan Rangkuman bukan dari tema: ${t.tema}`);
  insight.push(quoteRow('Rangkuman', nAll, t, d, num, text));
});
T.rangkuman.baik.filter(t => t.quote && t.count / nAll < 0.3).forEach(t => errors.push(`Kutipan Rangkuman untuk tema di bawah 30%: ${t.tema}`));

const info = [['Day', 'Tanggal', 'Tutor', 'Asisten Tutor', 'Topik', 'Jumlah Peserta'], ...DAYS.map(d => [String(d), ...INFO[d], String(PESERTA)])];

fs.writeFileSync(path.join(__dirname, 'sheet-data.json'), JSON.stringify({ feedback, info, insight }, null, 1));
console.log(`feedback ${feedback.length - 1} baris, insight ${insight.length - 1} baris`);
for (const r of insight.slice(1).filter(r => r[1] === 'Suara Mayoritas')) console.log(`${r[0].padEnd(9)} ${r[2]}`);
if (errors.length) { console.error('\nMASALAH:\n' + errors.join('\n')); process.exit(1); }
