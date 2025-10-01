import { executeCommand } from '../lib/command-helper.js';

export async function playNote(frequency, duration) {
  await executeCommand('playNote', { frequency, duration }, `Playing note: frequency=${frequency}Hz, duration=${duration}ms...`);
}
