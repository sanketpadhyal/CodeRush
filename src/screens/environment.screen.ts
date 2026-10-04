import os from 'os';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';
import { theme, center, getTerminalWidth, enableBlackBackground } from '../theme/theme.js';
import { ApiService } from '../services/api.service.js';

const apiService = new ApiService();

export const showEnvironmentScreen = async (initialCode?: string): Promise<void> => {
  enableBlackBackground();
  process.stdout.write('\x1b[?1049h\x1b[?25l');

  const cwd = process.cwd();
  const home = os.homedir();
  const displayPath = cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd;

  const renderHeader = () => {
    process.stdout.write('\x1b[3J\x1b[2J\x1b[H');
    console.log(theme.dim(displayPath) + '\n\n');
  };

  renderHeader();
  process.stdout.write('\x1b[?25h');

  console.log(center(theme.title('Code Retrieval & Sync Environment')));
  console.log('\n');

  let shareCode = initialCode;

  if (!shareCode) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'code',
        message: theme.boldWhite('Enter CodeRush Share Code:'),
        validate: (input: string) => input.trim().length > 0 || 'Share code is required',
      },
    ]);
    shareCode = answer.code.trim();
  }

  process.stdout.write('\x1b[?25l');

  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let fIdx = 0;
  const spinInterval = setInterval(() => {
    process.stdout.write(`\r${theme.accent(frames[fIdx])} ${theme.subtle(`Fetching snippet '${shareCode}' from cloud...`)}`);
    fIdx = (fIdx + 1) % frames.length;
  }, 60);

  let snippet;
  try {
    snippet = await apiService.pull(shareCode!);
    clearInterval(spinInterval);
  } catch (error) {
    clearInterval(spinInterval);
    process.stdout.write('\r\x1b[K');
    console.log('\n' + theme.error(`Error pulling snippet: ${(error as Error).message}`) + '\n');
    await inquirer.prompt([{ type: 'input', name: 'continue', message: theme.dim('Press Enter to return...') }]);
    process.stdout.write('\x1b[?1049l');
    return;
  }

  process.stdout.write('\r\x1b[K');

  for (let i = 0; i < 3; i++) {
    process.stdout.write(`\r${theme.mint('✓')} ${theme.code('Snippet retrieved!')}`);
    await new Promise((r) => setTimeout(r, 100));
    process.stdout.write(`\r${theme.accent('✔')} ${theme.code('Snippet retrieved!')}`);
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('\n\n');

  const destPath = path.resolve(cwd, snippet.fileName);
  fs.writeFileSync(destPath, snippet.code, 'utf8');

  const resultCard = [
    `${theme.mint('✔')}  ${theme.code('Successfully obtained code file!')}`,
    '',
    `   ${theme.muted('File Name:')}   ${theme.boldWhite(snippet.fileName)}`,
    `   ${theme.muted('Author:')}      ${theme.boldWhite(snippet.author || 'Unknown')}`,
    `   ${theme.muted('Language:')}    ${theme.subtle(snippet.language)}`,
    `   ${theme.muted('Saved To:')}    ${theme.accent(destPath)}`,
  ];

  console.log(resultCard.map((l) => '  ' + l).join('\n'));
  console.log('\n');

  process.stdout.write('\x1b[?25h');
  await inquirer.prompt([
    {
      type: 'input',
      name: 'done',
      message: theme.dim('Press Enter to exit...'),
    },
  ]);

  process.stdout.write('\x1b[?1049l');
};
