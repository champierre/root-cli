#!/usr/bin/env node

import { Command } from 'commander';
import { connect } from './commands/connect.js';

const program = new Command();

program
  .name('root-cli')
  .description('CLI tool to control iRobot Root robot')
  .version('1.0.0');

program
  .command('connect')
  .description('Connect to Root robot via BLE')
  .action(connect);

program.parse();
