import { theme, center, centerBlock, getTerminalHeight, getTerminalWidth, enableBlackBackground, resetTerminalBackground } from '../theme/theme.js';
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

    enableBlackBackground();
    process.stdout.write('\x1b[?1049h\x1b[?25l');

    const render = () => {
      const height = getTerminalHeight();
      const width = getTerminalWidth();

      const isCompact = height < 24;
      const lines: string[] = [];

      const logoStr = renderLogo(isCompact ? 'compact' : 'full');
      lines.push(...logoStr.split('\n'));
      lines.push('');
      lines.push(center(theme.text(title), width));
      lines.push('');

      const menuLines: string[] = [];

      options.forEach((opt, idx) => {
        const isSelected = idx === selectedIndex;
        if (isSelected) {
          const pointer = theme.accent('❯');
          const label = theme.boldWhite(opt.label);
          menuLines.push(`${pointer}  ${label}`);
          if (opt.description) {
            menuLines.push(`   ${theme.muted(opt.description)}`);
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
      lines.push(...centeredMenu.split('\n'));
      lines.push('');
      lines.push(center(`${theme.boldWhite('ctrl+c')}  ${theme.muted('quit')}`, width));

      const totalLines = lines.length;
      const topPadding = Math.max(0, Math.floor((height - totalLines) / 2));
      const paddedOutput = '\n'.repeat(topPadding) + lines.join('\n');

      process.stdout.write('\x1b[2J\x1b[H' + paddedOutput);
    };

    render();

    const onResize = () => {
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
      resetTerminalBackground();
      process.stdout.write('\x1b[?25h\x1b[?1049l');
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
