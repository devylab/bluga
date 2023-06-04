const child_process = require('child_process');
const fs = require('fs');

if (!fs.existsSync('./secret_key')) {
  child_process.execSync('npm run generate:secret', { stdio: [0, 1, 2] });
}
