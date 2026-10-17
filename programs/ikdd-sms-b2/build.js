// IKDD SMS Batch 2 is a single self-contained page (assets inlined, data read live from the sheet),
// migrated as-is from Netlify. "Build" only copies it to dist/ so scripts/build-site.js can pick it up.
const fs = require('fs');
const path = require('path');
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'index.template.html'), path.join(__dirname, 'dist', 'index.html'));
console.log('dist/index.html written');
