const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src/app/(dashboard)');
if (!fs.existsSync(dashboardDir)) fs.mkdirSync(dashboardDir, { recursive: true });

const pages = ['page.js', 'pockets', 'transactions', 'budgets', 'insights'];

pages.forEach(p => {
  const oldPath = path.join(__dirname, 'src/app', p);
  const newPath = path.join(dashboardDir, p);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
});

// Prepend "use client" to the .js files
const jsFiles = [
  path.join(dashboardDir, 'page.js'),
  path.join(dashboardDir, 'pockets/page.js'),
  path.join(dashboardDir, 'transactions/page.js'),
  path.join(dashboardDir, 'budgets/page.js'),
  path.join(dashboardDir, 'insights/page.js'),
];

jsFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    if (!c.startsWith('"use client";')) {
      fs.writeFileSync(f, '"use client";\n' + c);
    }
  }
});
