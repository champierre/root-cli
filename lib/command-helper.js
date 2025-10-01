import { sendCommand } from './ipc.js';

export async function executeCommand(commandName, params, message) {
  console.log(message);

  try {
    const result = await sendCommand({
      command: commandName,
      params
    });

    console.log('Command completed:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}
