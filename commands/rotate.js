import { executeCommand } from '../lib/command-helper.js';

export async function rotate(angle) {
  await executeCommand('rotate', { angle }, `Rotating ${angle} degrees...`);
}
