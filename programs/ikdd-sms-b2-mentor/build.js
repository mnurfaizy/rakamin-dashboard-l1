// IKDD SMS Batch 2, Mentoring Final Project: one self-contained page that reads the mentoring sheet live.
// Build inlines the brand assets (logos + deck background, taken from ikdd-sms-b2) into dist/index.html.
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(__dirname, 'index.template.html'), 'utf8');
const assets = fs.readFileSync(path.join(__dirname, 'brand', 'assets.html'), 'utf8');
if (!template.includes('<!--ASSETS-->')) throw new Error('index.template.html: missing <!--ASSETS--> placeholder');
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'index.html'), template.replace('<!--ASSETS-->', () => assets));
console.log('dist/index.html written');
