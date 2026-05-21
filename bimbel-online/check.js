const { execSync } = require('child_process');
try {
  const output = execSync('npm run build', { encoding: 'utf-8' });
  console.log('SUCCESS\n', output);
} catch (error) {
  console.log('ERROR\n', error.stdout);
  console.error(error.stderr);
}
