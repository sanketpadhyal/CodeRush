import inquirer from 'inquirer';
import { theme, center } from '../theme/theme.js';
import { renderLogo } from '../ui/logo.js';
import { UserCommand } from '../commands/user.command.js';

export const showEnvironmentScreen = async (): Promise<void> => {
  const userCommand = new UserCommand();

  console.clear();
  console.log('\n');
  console.log(renderLogo('braille'));
  console.log('\n');
  console.log(center(theme.text('CodeRush Terminal Environment')));
  console.log('\n');
  console.log(center(theme.code('WORKSPACE READY')));
  console.log('\n');

  const { envAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'envAction',
      message: theme.text('Select action:'),
      choices: [
        { name: 'Fetch User Profile', value: 'user' },
        { name: 'View System Information', value: 'sys' },
        { name: 'Exit', value: 'exit' },
      ],
    },
  ]);

  if (envAction === 'user') {
    const { userId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: theme.text('Enter User ID:'),
        default: '1',
      },
    ]);
    await userCommand.fetchAndSave(userId);
  } else if (envAction === 'sys') {
    console.log('\n' + center(theme.subtle(`Node: ${process.version} · Platform: ${process.platform} · Arch: ${process.arch}`)) + '\n');
  } else {
    process.exit(0);
  }
};
