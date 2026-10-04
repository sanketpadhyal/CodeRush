import { theme, center, centerBlock } from '../theme/theme.js';
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

    const render = () => {
      console.clear();
      console.log('\n');
      console.log(renderLogo('braille'));
      console.log('\n');
      console.log(center(theme.text(title)));
      console.log('\n');

      const lines: string[] = [];

      options.forEach((opt, idx) => {
        const isSelected = idx === selectedIndex;
        if (isSelected) {
          const pointer = theme.accent('❯');
          const icon = theme.mint(opt.icon);
          const label = theme.code(opt.label);
          lines.push(`${pointer}  ${icon}  ${label}`);
          if (opt.description) {
            lines.push(`      ${theme.subtle(opt.description)}`);
          }
        } else {
          const pointer = ' ';
          const icon = theme.muted(opt.icon);
          const label = theme.muted(opt.label);
          lines.push(`${pointer}  ${icon}  ${label}`);
          if (opt.description) {
            lines.push(`      ${theme.dim(opt.description)}`);
          }
        }
        if (idx < options.length - 1) {
          lines.push('');
        }
      });

      console.log(centerBlock(lines));
      console.log('\n\n');
      console.log(center(theme.dim('↑↓ navigate   enter select   ctrl+c quit')));
      console.log('\n');
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
      process.stdin.removeListener('data', onData);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
    };

    process.stdin.on('data', onData);
  });
};
