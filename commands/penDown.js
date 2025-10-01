import { sendCommand } from '../lib/ipc.js';

export async function penDown() {
  console.log('Pen down...');

  try {
    const result = await sendCommand({
      command: 'penDown',
      params: {}
    });

    console.log('Command completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
