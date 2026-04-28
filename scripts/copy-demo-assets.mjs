import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'demo');
const target = resolve(root, 'dist', 'demo');

if (!existsSync(source)) {
  console.warn('[copy:demo] demo directory was not found; skipping.');
  process.exit(0);
}

rmSync(target, { recursive: true, force: true });
cpSync(source, target, {
  recursive: true,
  filter: (path) => !path.endsWith('.DS_Store'),
});

console.log('[copy:demo] copied demo/ to dist/demo/');
