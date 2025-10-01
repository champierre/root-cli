#!/usr/bin/env node

import { Command } from 'commander';
import { startDaemon } from './commands/daemon.js';
import { forward } from './commands/forward.js';
import { rotate } from './commands/rotate.js';
import { penUp } from './commands/penUp.js';
import { penDown } from './commands/penDown.js';
import { playNote } from './commands/playNote.js';

const program = new Command();

program
  .name('rt0-cli')
  .description('CLI tool to control iRobot Root robot')
  .version('1.0.0')
  .allowUnknownOption(true);

program
  .command('forward <distance>')
  .description('Move forward by specified distance in mm (use -- before negative values)')
  .action(forward);

program
  .command('rotate <angle>')
  .description('Rotate by specified angle in degrees (use -- before negative values)')
  .action(rotate);

program
  .command('penUp')
  .description('Raise the pen')
  .action(penUp);

program
  .command('penDown')
  .description('Lower the pen')
  .action(penDown);

program
  .command('playNote <frequency> <duration>')
  .description('Play a note with specified frequency (Hz) and duration (ms)')
  .action(playNote);

// If no command provided, start daemon mode
if (process.argv.length === 2) {
  startDaemon();
} else {
  program.parse();
}
