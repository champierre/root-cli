import { sendCommand } from '../lib/ipc.js';

export async function rotate(angle) {
  console.log(`Rotating ${angle} degrees...`);

  try {
    const result = await sendCommand({
      command: 'rotate',
      params: { angle }
    });

    console.log('Command completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
