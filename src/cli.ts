#!/usr/bin/env node
import { Command } from 'commander';
import { runGrokMenu } from './ui/menu.js';
import { showGetStartedScreen } from './screens/get-started.screen.js';
import { showEnvironmentScreen } from './screens/environment.screen.js';
import { setTerminalTitle } from './theme/theme.js';

setTerminalTitle('coderush');

const program = new Command();

program
  .name('coderush')
  .description('Code shortcut & high-speed developer cloud environment')
  .version('1.0.0');

program
  .command('serve')
  .alias('push')
  .description('Serve a local code file to CodeRush cloud')
  .action(async () => {
    await showGetStartedScreen();
  });

program
  .command('pull [code]')
  .description('Pull and sync remote code file to local workspace')
  .action(async (code?: string) => {
    await showEnvironmentScreen(code);
  });

program
  .command('start')
  .description('Quick onboarding and code serving')
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
