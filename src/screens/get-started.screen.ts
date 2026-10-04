import inquirer from 'inquirer';
import { theme, center } from '../theme/theme.js';
import { renderLogo } from '../ui/logo.js';

export const showGetStartedScreen = async (): Promise<void> => {
  console.clear();
  console.log('\n');
  console.log(renderLogo('braille'));
  console.log('\n');
  console.log(center(theme.text('CodeRush · Quickstart Guide')));
  console.log('\n');
  console.log(center(theme.code('GET STARTED')));
  console.log('\n');

  const lines = [
    `${theme.accent('1.')} ${theme.text('Run CLI commands directly:')} ${theme.subtle('coderush user <id>')}`,
    `${theme.accent('2.')} ${theme.text('Launch interactive mode:')} ${theme.subtle('coderush interactive')}`,
    `${theme.accent('3.')} ${theme.text('Display help & shortcuts:')} ${theme.subtle('coderush --help')}`,
  ];

  console.log(center(lines.join('\n')));
  console.log('\n');

  const { nextAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'nextAction',
      message: theme.text('Select next step:'),
      choices: [
        { name: 'Enter Environment', value: 'env' },
        { name: 'Back to Menu', value: 'menu' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  if (nextAction === 'exit') {
    process.exit(0);
  }
};
