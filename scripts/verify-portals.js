const fs = require('fs');
const path = require('path');

const checks = {
  mustExist: [
    'src/app/admin',
    'src/app/app',
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/app/page.tsx', // Assuming a public landing page is desired
  ],
  mustNotExist: [
    'src/app/login',
    'src/app/register',
    'src/app/portal',
  ],
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function runChecks() {
  console.log(colors.cyan, 'Verifying Two-Portal Architecture...\n', colors.reset);
  let errors = 0;

  // 1. Check for required files/folders
  console.log(colors.yellow, 'Checking for required paths:', colors.reset);
  checks.mustExist.forEach(p => {
    const fullPath = path.join(process.cwd(), p);
    if (fs.existsSync(fullPath)) {
      console.log(`  ${colors.green}✓ OK:${colors.reset}   '${p}' exists.`);
    } else {
      console.error(`  ${colors.red}✗ ERROR:${colors.reset} '${p}' is missing.`);
      errors++;
    }
  });

  console.log('');

  // 2. Check for obsolete files/folders
  console.log(colors.yellow, 'Checking for obsolete paths:', colors.reset);
  checks.mustNotExist.forEach(p => {
    const fullPath = path.join(process.cwd(), p);
    if (!fs.existsSync(fullPath)) {
      console.log(`  ${colors.green}✓ OK:${colors.reset}   '${p}' does not exist.`);
    } else {
      console.error(`  ${colors.red}✗ ERROR:${colors-reset} Obsolete path '${p}' still exists.`);
      errors++;
    }
  });
  
  console.log('');

  if (errors === 0) {
    console.log(colors.green, '✅ Verification successful! All checks passed.', colors.reset);
    process.exit(0);
  } else {
    console.error(
      colors.red,
      `🔥 Verification failed. Found ${errors} structural error(s).`,
      colors.reset
    );
    console.error(colors.yellow, 'Please review the error messages above and correct the file structure.', colors.reset);
    process.exit(1);
  }
}

runChecks();
