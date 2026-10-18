// Builds every program and assembles ONE static site in site/, one sub-path per program:
//   site/goto-pm/  site/bsi-bpi-sdp-batch-2-3/  site/bsi-bpi-sdp-angkatan-10/  site/bsi-bpi-mastery/  site/ikdd-sms-batch-1/  site/ikdd-sms-batch-2/  site/gojek-magang-driver-kids/
// and the L1 Insight Hub (programs/insight-hub) at the site root, site/index.html.
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
  { dir: 'bsi-bpi-mastery', slug: 'bsi-bpi-mastery', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'ikdd-sms-b1', slug: 'ikdd-sms-batch-1', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'ikdd-sms-b2', slug: 'ikdd-sms-batch-2', steps: ['node build.js'] },
  { dir: 'goto-driver-kids', slug: 'gojek-magang-driver-kids', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  // L1 Insight Hub: the site root (empty slug). It links every program above and lists all clients, so share it only inside the team.
  { dir: 'insight-hub', slug: '', steps: ['node build.js'] },
];

const site = path.join(root, 'site');
fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

for (const p of PROGRAMS) {
  const cwd = path.join(root, 'programs', p.dir);
  for (const step of p.steps) execSync(step, { cwd, stdio: ['ignore', 'ignore', 'inherit'] });
  const out = path.join(site, p.slug);
  fs.mkdirSync(out, { recursive: true });
  fs.copyFileSync(path.join(cwd, 'dist', p.file || 'index.html'), path.join(out, 'index.html'));
  console.log(`/${p.slug ? `${p.slug}/` : ''}  <-  programs/${p.dir}`);
}

fs.writeFileSync(path.join(site, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`site/ ready (${PROGRAMS.length} programs)`);
