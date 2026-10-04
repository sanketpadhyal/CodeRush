#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import { renderGrokTheme } from './ui/view.js';
import { UserCommand } from './commands/user.command.js';
import { theme } from './theme/theme.js';

const program = new Command();
const userCommand = new UserCommand();

program
  .name('coderush')
  .description('Code shortcut & high-speed developer terminal environment')
  .version('1.0.0');

program
  .command('user <id>')
  .description('Fetch and save remote user data')
  .action(async (id: string) => {
    await userCommand.fetchAndSave(id);
  });

program
  .command('interactive')
  .alias('i')
  .description('Launch interactive shortcut dashboard')
  .action(async () => {
    renderGrokTheme({
      title: 'CodeRush Interactive Console',
      badge: 'ACTIVE SESSION',
      subtitle: 'Select an operation to execute in your workspace',
      instructions: [
        'Use arrow keys to navigate options',
        'Press Enter to select',
      ],
      status: 'Awaiting input...',
      footer: 'ctrl+c  quit',
    });

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: theme.text('Select action:'),
        choices: [
          { name: 'Fetch User Profile', value: 'user' },
          { name: 'Display System Banner', value: 'banner' },
          { name: 'Exit', value: 'exit' },
        ],
      },
    ]);

    if (action === 'user') {
      const { userId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'userId',
          message: theme.text('Enter User ID:'),
          default: '1',
        },
      ]);
      await userCommand.fetchAndSave(userId);
    } else if (action === 'banner') {
      renderGrokTheme();
    } else {
      process.exit(0);
    }
  });

program
  .action(() => {
    renderGrokTheme();
  });

program.parse(process.argv);
