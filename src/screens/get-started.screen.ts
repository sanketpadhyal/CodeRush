import os from 'os';
import path from 'path';
import inquirer from 'inquirer';
import { theme, center, getTerminalWidth, enableBlackBackground } from '../theme/theme.js';
import { ApiService } from '../services/api.service.js';
import { FileTool } from '../tools/file.tool.js';

const apiService = new ApiService();

export const showGetStartedScreen = async (): Promise<void> => {
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

  console.log(center(theme.title('Code Serving & Cloud Publishing')));
  console.log('\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'developerName',
      message: theme.boldWhite('Enter developer name:'),
      default: 'Sanket Padhyal',
      validate: (input: string) => input.trim().length > 0 || 'Developer name is required',
    },
    {
      type: 'input',
      name: 'filePath',
      message: theme.boldWhite('⚲ Enter file path to serve:'),
      validate: (input: string) => input.trim().length > 0 || 'File path is required',
    },
  ]);

  let fileName = '';
  let codeContent = '';
  let resolvedFilePath = '';

  try {
    resolvedFilePath = FileTool.resolvePath(answers.filePath);
    if (FileTool.fileExists(resolvedFilePath)) {
      const fileData = FileTool.readFile(resolvedFilePath);
      fileName = fileData.fileName;
      codeContent = fileData.content;
    } else {
      fileName = path.basename(resolvedFilePath);
      const codeAnswer = await inquirer.prompt([
        {
          type: 'editor',
          name: 'code',
          message: theme.subtle(`File '${fileName}' not found on disk. Enter or paste code content:`),
          validate: (input: string) => input.trim().length > 0 || 'Code content cannot be empty',
        },
      ]);
      codeContent = codeAnswer.code;
    }
  } catch (err) {
    console.log('\n' + theme.error(`File Read Error: ${(err as Error).message}`) + '\n');
    await inquirer.prompt([{ type: 'input', name: 'continue', message: theme.dim('Press Enter to return...') }]);
    process.stdout.write('\x1b[?1049l');
    return;
  }

  process.stdout.write('\x1b[?25l');

  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let fIdx = 0;
  const spinInterval = setInterval(() => {
    process.stdout.write(`\r${theme.accent(frames[fIdx])} ${theme.subtle('Uploading code to CodeRush cloud...')}`);
    fIdx = (fIdx + 1) % frames.length;
  }, 60);

  let result;
  try {
    result = await apiService.generate({
      fileName,
      code: codeContent,
      author: answers.developerName.trim(),
    });
    clearInterval(spinInterval);
  } catch (error) {
    clearInterval(spinInterval);
    process.stdout.write('\r\x1b[K');
    console.log('\n' + theme.error(`Error saving to server: ${(error as Error).message}`) + '\n');
    console.log(theme.subtle('Ensure the backend server is running on http://localhost:5001\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: theme.dim('Press Enter to return...') }]);
    process.stdout.write('\x1b[?1049l');
    return;
  }

  process.stdout.write('\r\x1b[K');

  for (let i = 0; i < 3; i++) {
    process.stdout.write(`\r${theme.mint('✓')} ${theme.code('Saved to server!')}`);
    await new Promise((r) => setTimeout(r, 100));
    process.stdout.write(`\r${theme.accent('✔')} ${theme.code('Saved to server!')}`);
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log('\n\n');

  const resultCard = [
    `${theme.mint('✔')}  ${theme.code('Successfully served to Firestore!')}`,
    '',
    `   ${theme.muted('File Name:')}   ${theme.boldWhite(result.fileName)}`,
    `   ${theme.muted('Developer:')}   ${theme.boldWhite(result.author || answers.developerName)}`,
    `   ${theme.muted('Share Code:')}  ${theme.accent(result.shareCode)}`,
    '',
    `   ${theme.subtle('Now pull in any system you want:')}`,
    `   ${theme.code(`coderush pull ${result.shareCode}`)}`,
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
