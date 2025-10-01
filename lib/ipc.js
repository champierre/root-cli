import net from 'net';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

const SOCKET_DIR = path.join(os.tmpdir(), 'root-cli');
const SOCKET_PATH = path.join(SOCKET_DIR, 'daemon.sock');

export { SOCKET_PATH };

export async function ensureSocketDir() {
  await fs.mkdir(SOCKET_DIR, { recursive: true });
}

export async function cleanupSocket() {
  try {
    await fs.unlink(SOCKET_PATH);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

export function createIPCServer(commandHandler) {
  const server = net.createServer((socket) => {
    socket.on('data', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received command:', message);

        const result = await commandHandler(message);

        socket.write(JSON.stringify({ success: true, result }));
        socket.end();
      } catch (error) {
        console.error('Command error:', error);
        socket.write(JSON.stringify({ success: false, error: error.message }));
        socket.end();
      }
    });
  });

  return server;
}

export function sendCommand(command) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(SOCKET_PATH, () => {
      client.write(JSON.stringify(command));
    });

    client.on('data', (data) => {
      const response = JSON.parse(data.toString());
      client.end();

      if (response.success) {
        resolve(response.result);
      } else {
        reject(new Error(response.error));
      }
    });

    client.on('error', (error) => {
      reject(new Error(`Failed to connect to daemon: ${error.message}`));
    });
  });
}
