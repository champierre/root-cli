import { executeCommand } from '../lib/command-helper.js';

export async function penDown() {
  await executeCommand('penDown', {}, 'Pen down...');
}
