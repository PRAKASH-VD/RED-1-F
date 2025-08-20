const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const searchTerms = [
  'https://red1-1-0-0.onrender.com',
  'red1-1-0-0.onrender.com',
  'VITE_API_BASE_URL',
  'VITE_API'
];

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (d.name === 'node_modules' || d.name === 'dist') return;
      walk(full, cb);
    } else {
      cb(full);
    }
  });
}

const hits = {};
walk(ROOT, (file) => {
  const ext = path.extname(file).toLowerCase();
  if (!['.js','.jsx','.ts','.tsx','.json','.env','.toml','.html'].includes(ext)) return;
  try {
    const content = fs.readFileSync(file, 'utf8');
    searchTerms.forEach((term) => {
      if (content.includes(term)) {
        hits[file] = hits[file] || [];
        hits[file].push(term);
      }
    });
  } catch (e) {}
});

if (Object.keys(hits).length === 0) {
  console.log('No occurrences found for search terms.');
  process.exit(0);
}

console.log('Found occurrences:');
Object.keys(hits).forEach((f) => {
  console.log(`\n${f}`);
  console.log('  ->', [...new Set(hits[f])].join(', '));
});
console.log('\nFix the files above by removing hardcoded URLs or by using the shared api instance (src/apiBase.js).');
