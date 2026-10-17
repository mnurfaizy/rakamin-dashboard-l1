// Embeds brand assets and the sheet snapshot, then writes dist/index.html (the folder that is deployed).
// Usage (from this folder): node data/build-sheet-data.js && node build.js
const fs = require('fs');
const path = require('path');

const here = __dirname;
const asset = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(here, 'brand', file)).toString('base64')}`;
const snapshot = JSON.parse(fs.readFileSync(path.join(here, 'data', 'sheet-data.json'), 'utf8'));

const replacements = {
  __SHEET_ID__: '__SHEET_ID__',
  __ASSET_YAYASAN__: asset('logo-yayasan.png', 'image/png'),
  __ASSET_RAKAMIN__: asset('logo-rakamin.png', 'image/png'),
  __ASSET_GOJEK__: asset('logo-gojek.png', 'image/png'),
  __ASSET_GOFOOD__: asset('logo-gofood.png', 'image/png'),
  __ASSET_BADGE__: asset('badge-magang.png', 'image/png'),
  // Escape "</" so answer text can never close the script tag.
  __SNAPSHOT__: JSON.stringify(snapshot).replace(/<\//g, '<\\/'),
};

let html = fs.readFileSync(path.join(here, 'index.template.html'), 'utf8');
for (const [key, value] of Object.entries(replacements)) html = html.split(key).join(value);

fs.mkdirSync(path.join(here, 'dist'), { recursive: true });
fs.writeFileSync(path.join(here, 'dist', 'index.html'), html);
console.log(`dist/index.html written (${Math.round(html.length / 1024)} KB)`);
