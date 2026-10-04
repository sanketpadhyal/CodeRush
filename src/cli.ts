#!/usr/bin/env node
import { Command } from 'commander';
import { runGrokMenu } from './ui/menu.js';
import { showGetStartedScreen } from './screens/get-started.screen.js';
import { showEnvironmentScreen } from './screens/environment.screen.js';
import { UserCommand } from './commands/user.command.js';
import { setTerminalTitle } from './theme/theme.js';

setTerminalTitle('coderush');

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
  .command('start')
  .description('Quick onboarding and setup guide')
  .action(async () => {
    await showGetStartedScreen();
  });

program
  .command('env')
  .description('Launch CodeRush developer environment')
  .action(async () => {
    await showEnvironmentScreen();
  });

program
  .action(async () => {
    const selected = await runGrokMenu();
    if (selected === 'get-started') {
      await showGetStartedScreen();
    } else if (selected === 'enter-env') {
      await showEnvironmentScreen();
    }
  });

program.parse(process.argv);
