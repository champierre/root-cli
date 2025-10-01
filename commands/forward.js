import { executeCommand } from '../lib/command-helper.js';

export async function forward(distance) {
  await executeCommand('forward', { distance }, `Moving forward ${distance}mm...`);
}
