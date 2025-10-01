import { sendCommand } from '../lib/ipc.js';

export async function penUp() {
  console.log('Pen up...');

  try {
    const result = await sendCommand({
      command: 'penUp',
      params: {}
    });

    console.log('Command completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
