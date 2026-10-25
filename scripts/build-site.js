// Builds every program and assembles ONE static site in site/, one sub-path per program:
//   site/goto-pm/  site/bsi-bpi-sdp-batch-2-3/  site/bsi-bpi-sdp-angkatan-10/  site/bsi-bpi-mastery/  site/ikdd-sms-batch-1/  site/ikdd-sms-batch-2/  site/gojek-magang-driver-kids/
// and the L1 Insight Hub (programs/insight-hub) at the site root, site/index.html.
// Used by a single Render static site (Build Command: node scripts/build-site.js, Publish Directory: site).
// To add a program: append it to PROGRAMS below (favicon = a name in assets/favicons/: hub, goto, bsi, dd).
// Favicons: the hub uses the Rakamin mark; every program uses the Rakamin mark overlapped by its client logo.
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const PROGRAMS = [
  { dir: 'goto-pm-workshop-b1', slug: 'goto-pm', favicon: 'goto', steps: ['node build.js'] },
  { dir: 'bsi-bpi-sdp-b2-b3', slug: 'bsi-bpi-sdp-batch-2-3', favicon: 'bsi', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'bsi-bpi-sdp-a10', slug: 'bsi-bpi-sdp-angkatan-10', favicon: 'bsi', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'bsi-bpi-mastery', slug: 'bsi-bpi-mastery', favicon: 'bsi', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'ikdd-sms-b1', slug: 'ikdd-sms-batch-1', favicon: 'dd', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  { dir: 'ikdd-sms-b2', slug: 'ikdd-sms-batch-2', favicon: 'dd', steps: ['node build.js'] },
  { dir: 'goto-driver-kids', slug: 'gojek-magang-driver-kids', favicon: 'goto', steps: ['node data/build-sheet-data.js', 'node build.js'] },
  // L1 Insight Hub: the site root (empty slug). It links every program above and lists all clients, so share it only inside the team.
  { dir: 'insight-hub', slug: '', favicon: 'hub', steps: ['node build.js'] },
  // Client view: daftar link per program untuk PIC klien, dibuat oleh build hub di atas (dist/client.html).
  { dir: 'insight-hub', slug: 'client-view', file: 'client.html', favicon: 'hub', steps: [] },
];

const site = path.join(root, 'site');
fs.rmSync(site, { recursive: true, force: true });
fs.mkdirSync(site, { recursive: true });

for (const p of PROGRAMS) {
  const cwd = path.join(root, 'programs', p.dir);
  for (const step of p.steps) execSync(step, { cwd, stdio: ['ignore', 'ignore', 'inherit'] });
  const out = path.join(site, p.slug);
  fs.mkdirSync(out, { recursive: true });
  let html = fs.readFileSync(path.join(cwd, 'dist', p.file || 'index.html'), 'utf8');
  if (p.favicon) {
    const png = fs.readFileSync(path.join(root, 'assets', 'favicons', p.favicon + '.png')).toString('base64');
    const tag = `<link rel="icon" type="image/png" href="data:image/png;base64,${png}"><link rel="apple-touch-icon" href="data:image/png;base64,${png}">`;
    if (!html.includes('</head>')) throw new Error(`${p.slug}: no </head> to add the favicon to`);
    html = html.replace('</head>', () => tag + '</head>');
  }
  fs.writeFileSync(path.join(out, 'index.html'), html);
  console.log(`/${p.slug ? `${p.slug}/` : ''}  <-  programs/${p.dir}`);
}

// Render keeps serving files from earlier deploys when a path disappears from site/, so retired
// paths get a small page that sends visitors to the hub instead of the stale content.
const RETIRED = ['insight-hub', 'uji-tiket'];
for (const slug of RETIRED) {
  fs.mkdirSync(path.join(site, slug), { recursive: true });
  fs.writeFileSync(path.join(site, slug, 'index.html'),
    '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex,nofollow">'
    + '<meta http-equiv="refresh" content="0;url=/"><title>Rakamin</title><a href="/">Dashboard Feedback L1</a>\n');
}

fs.writeFileSync(path.join(site, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`site/ ready (${PROGRAMS.length} programs)`);
