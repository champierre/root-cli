import { sendCommand } from '../lib/ipc.js';

export async function forward(distance) {
  console.log(`Moving forward ${distance}mm...`);

  try {
    const result = await sendCommand({
      command: 'forward',
      params: { distance }
    });

    console.log('Command completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
