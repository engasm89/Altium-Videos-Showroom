#!/usr/bin/env node
/**
 * Import data/videos.csv → catalog.generated.json (thin entry for CSV-primary flow).
 * Delegates to import-catalog.mjs --csv
 *
 * Usage:
 *   node scripts/import-videos-csv.mjs
 *   node scripts/import-videos-csv.mjs --skip-oembed
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = ['--csv', ...process.argv.slice(2)];
const child = spawn(process.execPath, [path.join(__dirname, 'import-catalog.mjs'), ...args], {
  stdio: 'inherit',
});
child.on('exit', (code) => process.exit(code ?? 1));
