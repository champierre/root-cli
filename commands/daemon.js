import noble from '@abandonware/noble';
import { createIPCServer, ensureSocketDir, cleanupSocket, SOCKET_PATH } from '../lib/ipc.js';
import { setDistance, appendCrc } from '../lib/protocol.js';

const ROOT_SERVICE_UUID = '48c5d828ac2a442d97a30c9822b04979';
const UART_SERVICE = '6e400001b5a3f393e0a9e50e24dcca9e';
const TX_CHAR_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';
const RX_CHAR_UUID = '6e400003b5a3f393e0a9e50e24dcca9e';

let device = null;
let rxChar = null;
let txChar = null;
let commandResolvers = new Map();

async function handleCommand(message) {
  const { command, params } = message;

  switch (command) {
    case 'forward':
      return await handleForward(params.distance);
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

async function handleForward(distance) {
  console.log(`Executing forward command: ${distance}mm`);

  if (!txChar || !rxChar) {
    throw new Error('Not connected to Root robot');
  }

  return new Promise(async (resolve, reject) => {
    const key = '1-8'; // driveDistance command key

    // Set up response handler
    commandResolvers.set(key, () => {
      console.log('Forward command completed');
      resolve({ status: 'completed' });
    });

    // Send command
    const commandData = setDistance(Number(distance));
    const commandWithCrc = appendCrc(commandData);

    try {
      await txChar.writeAsync(commandWithCrc, false);
      console.log('Command sent to robot');

      // Timeout after 10 seconds
      setTimeout(() => {
        if (commandResolvers.has(key)) {
          commandResolvers.delete(key);
          reject(new Error('Command timeout'));
        }
      }, 10000);
    } catch (error) {
      commandResolvers.delete(key);
      reject(error);
    }
  });
}

export async function startDaemon() {
  console.log('Searching for Root robot...');

  // Setup IPC server
  await ensureSocketDir();
  await cleanupSocket();

  const server = createIPCServer(handleCommand);
  server.listen(SOCKET_PATH, () => {
    console.log('IPC server listening on', SOCKET_PATH);
  });

  // Handle Ctrl-C
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, disconnecting...');
    server.close();
    await cleanupSocket();
    await disconnect();
    process.exit(0);
  });

  noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
      await noble.startScanningAsync([ROOT_SERVICE_UUID], false);
    } else {
      console.log('Bluetooth adapter is not powered on');
      process.exit(1);
    }
  });

  noble.on('discover', async (peripheral) => {
    console.log(`Found device: ${peripheral.advertisement.localName || 'Unknown'}`);

    await noble.stopScanningAsync();
    device = peripheral;

    try {
      console.log('Connecting to Root robot...');
      await peripheral.connectAsync();
      console.log('Connected to GATT server');

      const { characteristics } = await peripheral.discoverSomeServicesAndCharacteristicsAsync(
        [UART_SERVICE],
        [TX_CHAR_UUID, RX_CHAR_UUID]
      );

      txChar = characteristics.find(c => c.uuid === TX_CHAR_UUID);
      rxChar = characteristics.find(c => c.uuid === RX_CHAR_UUID);

      if (!txChar || !rxChar) {
        throw new Error('Required characteristics not found');
      }

      console.log('TX Characteristic found:', txChar.uuid);
      console.log('RX Characteristic found:', rxChar.uuid);

      // Subscribe to notifications
      await rxChar.subscribeAsync();
      rxChar.on('data', (data) => {
        const response = new Uint8Array(data);
        console.log('Response received:', response);

        // Handle command completion responses
        if (response.length >= 2 && response[0] === 1 && response[1] === 8) {
          const key = '1-8';
          const resolver = commandResolvers.get(key);
          if (resolver) {
            resolver();
            commandResolvers.delete(key);
          }
        }
      });

      console.log('Successfully connected to Root robot!');
      console.log('Ready to receive commands. Press Ctrl-C to disconnect and exit');
    } catch (error) {
      console.error('Connection error:', error);
      process.exit(1);
    }
  });
}

async function disconnect() {
  if (device && device.state === 'connected') {
    try {
      if (rxChar) {
        await rxChar.unsubscribeAsync();
        rxChar.removeAllListeners('data');
      }

      await device.disconnectAsync();
      console.log('Disconnected from Root Robot');

      device = null;
      rxChar = null;
      txChar = null;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }
}
