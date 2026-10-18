// Embeds the Rakamin logo, documentation photos and program data, then writes dist/index.html.
// Usage (from this folder): node build.js           -> dist/index.html (the hub)
//                            node build.js --lab     -> dist/lab.html (layout test page with sample programs)
const fs = require('fs');
const path = require('path');

const here = __dirname;
const LAB = process.argv.includes('--lab');
const DATA = LAB ? require('./data/lab')(require('./data/programs')) : require('./data/programs');
const photo = name => `data:image/jpeg;base64,${fs.readFileSync(path.join(here, 'photos', `${name}.jpg`)).toString('base64')}`;

// Sanity checks: every program points at a known client and has the numbers its card needs.
const clientIds = new Set(DATA.clients.map(c => c.id));
for (const p of DATA.programs) {
  if (!clientIds.has(p.client)) throw new Error(`${p.id}: unknown client "${p.client}"`);
  if (p.status !== 'segera' && !(p.responses > 0 && p.score >= 1 && p.score <= 5)) throw new Error(`${p.id}: responses/score missing`);
}

const png = name => `data:image/png;base64,${fs.readFileSync(path.join(here, 'brand', name)).toString('base64')}`;

const data = {
  ...DATA,
  clients: DATA.clients.map(({ logo, ...c }) => ({ ...c, logoImg: png(logo) })),
  programs: DATA.programs.map(({ photo: name, ...p }) => ({ ...p, img: name ? photo(name) : null })),
  hero: Object.fromEntries(Object.entries(DATA.hero).map(([k, v]) => [k, v && v.photo ? { alt: v.alt, img: photo(v.photo) } : v])),
};

const logo = fs.readFileSync(path.join(here, 'brand', 'logo-rakamin.svg'), 'utf8')
  .replace('<svg ', '<svg role="img" aria-label="Rakamin" style="display:block;width:100%;height:auto" ');

let html = fs.readFileSync(path.join(here, 'index.template.html'), 'utf8');
html = html.split('__LOGO_SVG__').join(logo);
// Escape "</" so quote text can never close the script tag.
html = html.replace('__DATA__', () => JSON.stringify(data).replace(/<\//g, '<\\/'));

fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
const out = LAB ? 'lab.html' : 'index.html';
fs.writeFileSync(path.join(here, 'dist', out), html);
console.log(`dist/${out} written (${Math.round(html.length / 1024)} KB)`);
