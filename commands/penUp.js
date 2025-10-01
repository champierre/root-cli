import { executeCommand } from '../lib/command-helper.js';

export async function penUp() {
  await executeCommand('penUp', {}, 'Pen up...');
}
