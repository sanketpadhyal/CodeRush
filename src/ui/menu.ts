import readline from 'readline';
import { theme, center, centerBlock, getTerminalWidth } from '../theme/theme.js';
import { renderLogo } from './logo.js';

export interface MenuOption {
  id: string;
  label: string;
  description?: string;
}

export const runGrokMenu = async (
  title: string = 'Welcome to CodeRush environment',
  options: MenuOption[] = [
    { id: 'get-started', label: 'Get Started', description: 'Quick onboarding & setup guide' },
    { id: 'enter-env', label: 'Enter Environment', description: 'Launch CodeRush developer workspace' },
  ]
): Promise<string> => {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    let isCleanedUp = false;
    let renderedLineCount = 0;

    console.clear();
    console.log('\n');
    console.log(renderLogo());
    console.log('\n');
    console.log(center(theme.text(title)));
    console.log('\n');

    process.stdout.write('\x1b[?25l');

    const render = () => {
      const width = getTerminalWidth();

      if (renderedLineCount > 0) {
        readline.moveCursor(process.stdout, 0, -renderedLineCount);
        readline.clearScreenDown(process.stdout);
      }

      const menuLines: string[] = [];

      options.forEach((opt, idx) => {
        const isSelected = idx === selectedIndex;
        if (isSelected) {
          const pointer = theme.accent('❯');
          const label = theme.code(opt.label);
          menuLines.push(`${pointer}  ${label}`);
          if (opt.description) {
            menuLines.push(`   ${theme.subtle(opt.description)}`);
          }
        } else {
          const label = theme.muted(opt.label);
          menuLines.push(`   ${label}`);
          if (opt.description) {
            menuLines.push(`   ${theme.dim(opt.description)}`);
          }
        }
        if (idx < options.length - 1) {
          menuLines.push('');
        }
      });

      const centeredMenu = centerBlock(menuLines, width);
      const outLines = [
        centeredMenu,
        '',
        center(theme.dim('↑↓ navigate   enter select   ctrl+c quit'), width),
      ];

      const outText = outLines.join('\n');
      process.stdout.write(outText + '\n');
      renderedLineCount = outText.split('\n').length;
    };

    render();

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onData = (key: string) => {
      if (key === '\u0003' || key === '\u0004' || key === 'q') {
        cleanup();
        process.exit(0);
      }

      if (key === '\r' || key === '\n') {
        cleanup();
        resolve(options[selectedIndex].id);
        return;
      }

      if (key === '\u001b[A' || key === 'k') {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      } else if (key === '\u001b[B' || key === 'j') {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      }
    };

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      process.stdout.write('\x1b[?25h');
      process.stdin.removeListener('data', onData);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };

    process.on('exit', cleanup);
    process.on('SIGINT', () => {
      cleanup();
      process.exit(0);
    });

    process.stdin.on('data', onData);
  });
};
