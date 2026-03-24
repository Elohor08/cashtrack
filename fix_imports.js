const fs = require('fs');
const path = require('path');

const dashboardDir = path.join(__dirname, 'src/app/(dashboard)');
const files = ['page.js', 'pockets/page.js', 'transactions/page.js', 'budgets/page.js', 'insights/page.js'];

files.forEach(f => {
  const p = path.join(dashboardDir, f);
  if (fs.existsSync(p)) {
     let c = fs.readFileSync(p, 'utf8');
     c = c.replace(/from '\.\.\/context/g, "from '@/context");
     c = c.replace(/from '\.\.\/components/g, "from '@/components");
     // also sometimes it might be just './context' or '../../context' but the old code was '../context'
     fs.writeFileSync(p, c);
  }
});
