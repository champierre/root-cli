#!/usr/bin/env node

import { Command } from 'commander';
import { startDaemon } from './commands/daemon.js';
import { forward } from './commands/forward.js';

const program = new Command();

program
  .name('root-cli')
  .description('CLI tool to control iRobot Root robot')
  .version('1.0.0');

program
  .command('forward <distance>')
  .description('Move forward by specified distance in mm')
  .action(forward);

// If no command provided, start daemon mode
if (process.argv.length === 2) {
  startDaemon();
} else {
  program.parse();
}
