// Builds every program and assembles ONE static site in site/, one sub-path per program:
//   site/goto-pm/  site/bsi-bpi-sdp-batch-2-3/  site/bsi-bpi-sdp-angkatan-10/
// Used by a single Render static site (Build Command: node scripts/build-site.js, Publish Directory: site).
// To add a program: append it to PROGRAMS below.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PROGRAMS = [
  { dir: 'goto-pm-workshop-b1', slug: 'goto-pm', steps: ['node build.js'] },
  { dir: 'bsi-bpi-sdp-b2-b3', slug: 'bsi-bpi-sdp-batch-2-3', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'bsi-bpi-sdp-a10', slug: 'bsi-bpi-sdp-angkatan-10', steps: ['node data/build-sheet-data.js', 'node build.js'] },
];

const site = path.join(root, 'site');
fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

for (const p of PROGRAMS) {
  const cwd = path.join(root, 'programs', p.dir);
  for (const step of p.steps) execSync(step, { cwd, stdio: ['ignore', 'ignore', 'inherit'] });
  const out = path.join(site, p.slug);
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(cwd, 'dist', 'index.html'), path.join(out, 'index.html'));
  console.log(`/${p.slug}/  <-  programs/${p.dir}`);
}

// The root page deliberately lists nothing: each client should only know its own link.
fs.writeFileSync(path.join(site, 'index.html'),
  '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Rakamin</title>'
  + '<p style="font:16px system-ui;margin:40px">Rakamin Learning Quality</p>\n');
fs.writeFileSync(path.join(site, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`site/ ready (${PROGRAMS.length} programs)`);
