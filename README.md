# root-cli

CLI tool to control iRobot Root robot via Bluetooth Low Energy (BLE).

## Installation

```bash
npm install
```

## Usage

### 1. Start daemon

Run without any command to connect to Root robot and maintain the connection:

```bash
node cli.js
```

The daemon will:
- Search for and connect to a nearby Root robot
- Maintain the BLE connection
- Start an IPC server to receive commands
- Press `Ctrl-C` to disconnect and exit

### 2. Send commands

While the daemon is running, open another terminal and send commands:

```bash
node cli.js forward <distance>
```

#### Available Commands

- `forward <distance>` - Move forward by specified distance in millimeters (negative value to move backward)
- `rotate <angle>` - Rotate by specified angle in degrees (negative value to rotate counter-clockwise)

Examples:
```bash
node cli.js forward 100
node cli.js rotate 90

# For negative values, use -- before the value
node cli.js forward -- -100
node cli.js rotate -- -90
```

## Architecture

- **Daemon mode**: `node cli.js` connects to the robot and maintains the BLE connection
- **Command mode**: `node cli.js <command>` sends a command to the daemon via Unix socket
- IPC socket: `/tmp/root-cli/daemon.sock`
- Commands are executed by the daemon process, which maintains the BLE connection

## Requirements

- Node.js
- Bluetooth adapter
- iRobot Root robot
