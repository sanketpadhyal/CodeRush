import readline from 'readline';
import { theme, center, centerBlock, getTerminalHeight } from '../theme/theme.js';
import { renderLogo } from './logo.js';

export interface MenuOption {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

export const runGrokMenu = async (
  title: string = 'Welcome to CodeRush environment',
  options: MenuOption[] = [
    { id: 'get-started', icon: '✦', label: 'Get Started', description: 'Quick onboarding & setup guide' },
    { id: 'enter-env', icon: '◆', label: 'Enter Environment', description: 'Launch CodeRush developer workspace' },
  ]
): Promise<string> => {
  return new Promise((resolve) => {
    let selectedIndex = 0;
    let isCleanedUp = false;

    process.stdout.write('\x1b[2J\x1b[H\x1b[?25l');

    const render = () => {
      const height = getTerminalHeight();
      const compact = height < 24;

      const buffer: string[] = [];

      if (!compact) {
        buffer.push('\n');
      }

      buffer.push(renderLogo());

      if (!compact) {
        buffer.push('\n');
      } else {
        buffer.push('');
      }

      buffer.push(center(theme.text(title)));

      if (!compact) {
        buffer.push('\n');
      } else {
        buffer.push('');
      }

      const menuLines: string[] = [];

      options.forEach((opt, idx) => {
        const isSelected = idx === selectedIndex;
        if (isSelected) {
          const pointer = theme.accent('❯');
          const icon = theme.mint(opt.icon);
          const label = theme.code(opt.label);
          menuLines.push(`${pointer}  ${icon}  ${label}`);
          if (opt.description) {
            menuLines.push(`      ${theme.subtle(opt.description)}`);
          }
        } else {
          const pointer = ' ';
          const icon = theme.muted(opt.icon);
          const label = theme.muted(opt.label);
          menuLines.push(`   ${icon}  ${label}`);
          if (opt.description) {
            menuLines.push(`      ${theme.dim(opt.description)}`);
          }
        }
        if (idx < options.length - 1) {
          menuLines.push('');
        }
      });

      buffer.push(centerBlock(menuLines));

      if (!compact) {
        buffer.push('\n\n');
      } else {
        buffer.push('\n');
      }

      buffer.push(center(theme.dim('↑↓ navigate   enter select   ctrl+c quit')));

      process.stdout.write('\x1b[H');
      process.stdout.write(buffer.join('\n'));
      readline.clearScreenDown(process.stdout);
    };

    render();

    const onResize = () => {
      process.stdout.write('\x1b[2J\x1b[H');
      render();
    };

    process.stdout.on('resize', onResize);

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
        process.stdout.write('\x1b[2J\x1b[H');
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
      process.stdout.removeListener('resize', onResize);
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
