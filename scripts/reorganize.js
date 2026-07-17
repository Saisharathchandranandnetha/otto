const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const appDir = path.join(root, 'apps', 'web', 'src', 'app');

const dirsToCreate = [
  '(marketing)',
  '(auth)',
  '(platform)',
  path.join('(workspace)', 'overview'),
  '(domains)'
];

// Create directories
dirsToCreate.forEach(dir => {
  const fullPath = path.join(appDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
});

// Move existing routes
const moves = [
  { from: 'login', to: path.join('(auth)', 'login') },
  { from: 'education', to: path.join('(domains)', 'education') },
  { from: 'inventory', to: path.join('(domains)', 'inventory') },
  { from: 'ledger', to: path.join('(domains)', 'ledger') },
  { from: 'vas', to: path.join('(domains)', 'vas') },
];

moves.forEach(move => {
  const source = path.join(appDir, move.from);
  const dest = path.join(appDir, move.to);
  if (fs.existsSync(source)) {
    console.log(`Moving ${source} to ${dest}`);
    fs.renameSync(source, dest);
  }
});

// Move page.tsx
const sourcePage = path.join(appDir, 'page.tsx');
const destPage = path.join(appDir, '(workspace)', 'overview', 'page.tsx');
if (fs.existsSync(sourcePage)) {
    console.log(`Moving page.tsx to (workspace)/overview/page.tsx`);
    fs.renameSync(sourcePage, destPage);
}

console.log('Reorganization complete.');
