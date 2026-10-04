#!/usr/bin/env node
import { Command } from 'commander';
import { UserCommand } from './commands/user.command.js';

const program = new Command();
const userCmd = new UserCommand();

program
  .name('my-cli')
  .description('Professional CLI for API and FS operations')
  .version('1.0.0');

program
  .command('save-user')
  .description('Fetch user data from API and save to local file')
  .argument('<id>', 'User ID to fetch')
  .action(async (id) => {
    await userCmd.fetchAndSave(id);
  });

program.parse();
