import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

console.log('Staging submodule in projecttrack...');
execSync('git -C projecttrack add electron Makefile', { cwd: root, stdio: 'inherit' });
try {
  execSync('git -C projecttrack commit -m "feat: update desktop overlay to bottom-right position"', { cwd: root, stdio: 'inherit' });
} catch (e) {
  console.log('Projecttrack commit note:', e.message);
}

console.log('Pushing Full-WorkTracker...');
execSync('git -C projecttrack push origin main', { cwd: root, stdio: 'inherit' });
console.log('ALL COMMITTED AND PUSHED SUCCESSFULLY!');
