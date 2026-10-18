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
];

// Internal shortcut back to the hub. Shown only when the program was opened from the hub (?dari=hub, remembered for the tab
// via sessionStorage), so clients who receive a direct program link never see it or learn that the hub exists.
const BACK_TO_HUB = '<script>(function(){var on=false;try{on=new URLSearchParams(location.search).get("dari")==="hub";'
  + 'if(on)sessionStorage.setItem("l1hub","1");else on=sessionStorage.getItem("l1hub")==="1"}catch(e){}'
  + 'if(!on)return;var s=document.createElement("style");'
  + 's.textContent=".hub-back{position:fixed;left:16px;bottom:16px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px 0 12px;border-radius:999px;'
  + 'background:#2F403B;color:#fff;font:500 13px/1 Rubik,system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none;box-shadow:0 4px 14px #2F403B33;outline:1px solid #FFFFFF8C;outline-offset:-1px;transition:transform .2s,box-shadow .2s}'
  + '.hub-back:hover{transform:translateY(-2px);box-shadow:0 14px 36px #2F403B4D}.hub-back:focus-visible{outline:2px solid #fff;outline-offset:2px}'
  + '.hub-back svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}@media print{.hub-back{display:none}}";'
  + 'document.head.appendChild(s);var a=document.createElement("a");a.className="hub-back";a.href="/";a.title="Kembali ke dashboard utama (internal)";'
  + 'a.innerHTML=\'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>Dashboard utama\';document.body.appendChild(a)})()</script>';

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
  if (p.slug) {
    if (!html.includes('</body>')) throw new Error(`${p.slug}: no </body> to add the hub button to`);
    html = html.replace(/<\/body>(?![\s\S]*<\/body>)/, () => BACK_TO_HUB + '</body>');
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
