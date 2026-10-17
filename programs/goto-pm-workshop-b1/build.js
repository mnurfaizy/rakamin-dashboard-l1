// Embeds brand assets as data URIs and writes dist/index.html (the folder that is deployed).
// Usage (from this folder): node build.js
const fs = require('fs');
const path = require('path');

const here = __dirname;
const brand = path.join(here, 'brand');
const dataUri = file => `data:image/png;base64,${fs.readFileSync(path.join(brand, file)).toString('base64')}`;

const assets = {
  __ASSET_GOTO__: dataUri('logo-goto.png'),
  __ASSET_RAKAMIN__: dataUri('logo-rakamin.png'),
  __ASSET_BG__: dataUri('bg-light.png'),
  __ASSET_MASCOT__: dataUri('mascot-thumbsup.png'),
};

let html = fs.readFileSync(path.join(here, 'index.template.html'), 'utf8');
for (const [key, uri] of Object.entries(assets)) html = html.split(key).join(uri);

const out = path.join(here, 'dist');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`dist/index.html written (${Math.round(html.length / 1024)} KB)`);
