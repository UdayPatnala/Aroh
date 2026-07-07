const fs = require('fs');
const path = require('path');

const excludeDirs = new Set(['.git', '.agents', 'node_modules', '.next']);
const files = [];

function walk(dir) {
  let list;
  try {
    list = fs.readdirSync(dir);
  } catch (err) {
    return;
  }
  for (const file of list) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      continue;
    }
    if (stat.isDirectory()) {
      if (!excludeDirs.has(file)) {
        walk(fullPath);
      }
    } else {
      if (file !== 'package-lock.json') {
        files.push({ path: fullPath, mtime: stat.mtimeMs });
      }
    }
  }
}

try {
  walk('d:\\PROJECT\\AROH');
  files.sort((a, b) => b.mtime - a.mtime);
  files.slice(0, 5).forEach(f => console.log(f.path));
} catch (e) {
  console.error(e);
}
