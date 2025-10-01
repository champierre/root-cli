import noble from '@abandonware/noble';

const ROOT_SERVICE_UUID = '48c5d828ac2a442d97a30c9822b04979';
const DEVICE_INFORMATION_SERVICE = '0000180a00001000800000805f9b34fb';
const UART_SERVICE = '6e400001b5a3f393e0a9e50e24dcca9e';
const TX_CHAR_UUID = '6e400002b5a3f393e0a9e50e24dcca9e';
const RX_CHAR_UUID = '6e400003b5a3f393e0a9e50e24dcca9e';

let device = null;
let rxChar = null;
let txChar = null;

export async function connect() {
  console.log('Searching for Root robot...');

  return new Promise((resolve, reject) => {
    noble.on('stateChange', async (state) => {
      if (state === 'poweredOn') {
        await noble.startScanningAsync([ROOT_SERVICE_UUID], false);
      } else {
        console.log('Bluetooth adapter is not powered on');
        reject(new Error('Bluetooth not available'));
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
          console.log('Response received:', new Uint8Array(data));
        });

        console.log('Successfully connected to Root robot!');
        resolve();
      } catch (error) {
        console.error('Connection error:', error);
        reject(error);
      }
    });
  });
}
