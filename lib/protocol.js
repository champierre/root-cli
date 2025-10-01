// CRC8 functions
export function generateCrc8Table() {
  const polynomial = 0x07;
  const table = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x80) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
    table[i] = crc & 0xFF;
  }
  return table;
}

const crcTable = generateCrc8Table();

export function crc8(data) {
  let crc = 0x00;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i];
    crc = crcTable[(crc ^ byte) & 0xFF];
  }
  return crc;
}

export function appendCrc(value) {
  const newValue = new Uint8Array(value.length + 1);
  newValue.set(value);
  newValue[19] = crc8(value);
  return newValue;
}

// Command builders
export function setDistance(distance) {
  const arr = new Uint8Array(19);
  arr[0] = 1;
  arr[1] = 8;
  arr[2] = 0;

  // Convert to signed 32-bit integer
  const value = distance | 0;
  arr[3] = (value >> 24) & 0xFF;
  arr[4] = (value >> 16) & 0xFF;
  arr[5] = (value >> 8) & 0xFF;
  arr[6] = value & 0xFF;
  return arr;
}

export function setAngle(angle) {
  const arr = new Uint8Array(19);
  arr[0] = 1;
  arr[1] = 12;
  arr[2] = 0;

  // Convert to decidegrees and signed 32-bit integer
  const angleValue = (angle * 10) | 0;
  arr[3] = (angleValue >> 24) & 0xFF;
  arr[4] = (angleValue >> 16) & 0xFF;
  arr[5] = (angleValue >> 8) & 0xFF;
  arr[6] = angleValue & 0xFF;
  return arr;
}

export function setPenUp() {
  const arr = new Uint8Array(19);
  arr[0] = 2;  // Device 2 = Marker/Eraser
  arr[1] = 0;  // Command 0 = Set position
  arr[2] = 0;  // Packet ID
  arr[3] = 0;  // 0 = up
  return arr;
}

export function setPenDown() {
  const arr = new Uint8Array(19);
  arr[0] = 2;  // Device 2 = Marker/Eraser
  arr[1] = 0;  // Command 0 = Set position
  arr[2] = 0;  // Packet ID
  arr[3] = 1;  // 1 = down
  return arr;
}
