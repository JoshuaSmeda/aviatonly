const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'd:/ShadcnDashboardPro-main/package/main/app/components/dashboards';
const allFiles = [];

function walk(d) {
  const items = fs.readdirSync(d);
  for(const item of items) {
    const fullPath = path.join(d, item);
    if(fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      if(fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        let base = path.basename(fullPath, path.extname(fullPath));
        let folder = path.basename(path.dirname(fullPath));
        allFiles.push(folder + '/' + base);
      }
    }
  }
}

walk(dir);

for (const file of allFiles) {
  try {
    const res = execSync('git grep --name-only ' + file, { cwd: 'd:/ShadcnDashboardPro-main/package/main/app' });
    let output = res.toString().trim();
    if(output.length === 0) {
      console.log('UNUSED: ' + file);
    }
  } catch (e) {
    console.log('UNUSED: ' + file);
  }
}
