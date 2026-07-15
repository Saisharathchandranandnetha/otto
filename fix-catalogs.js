const fs = require('fs');
const { execSync } = require('child_process');

const output = execSync('dir /s /b package.json', { encoding: 'utf8' });
const files = output.split('\\n').map(f => f.trim()).filter(f => f && f.includes('workflow-engine') && !f.includes('node_modules'));

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/"catalog:[^"]*"/g, '"*"');
    fs.writeFileSync(file, content);
  } catch (err) {
    console.error('Error with ' + file, err);
  }
});
console.log('Replaced all catalog references with *');
