import { theme, center, getTerminalWidth } from '../theme/theme.js';
import { renderLogo } from './logo.js';

export interface ViewOptions {
  title?: string;
  badge?: string;
  subtitle?: string;
  instructions?: string[];
  status?: string;
  footer?: string;
  logoVariant?: 'braille' | 'dots';
}

export const renderGrokTheme = (options: ViewOptions = {}): void => {
  const {
    title = 'Welcome to CodeRush environment',
    badge = 'CODERUSH-V1',
    subtitle = 'Engineered for high-speed terminal shortcuts & workflows',
    instructions = [
      'Run coderush --help to explore all commands',
      'Use coderush user <id> to fetch developer profile data',
    ],
    status = 'Ready for action...',
    footer = 'ctrl+c  quit',
    logoVariant = 'braille',
  } = options;

  console.clear();
  console.log('\n');
  console.log(renderLogo(logoVariant));
  console.log('\n');
  console.log(center(theme.text(title)));
  console.log('\n');
  console.log(center(theme.code(badge)));
  console.log('\n');
  console.log(center(theme.subtle(subtitle)));
  console.log('\n');

  if (instructions.length > 0) {
    const formatted = instructions.map((inst) => theme.muted(inst)).join('\n');
    console.log(center(formatted));
    console.log('\n');
  }

  if (status) {
    console.log(center(theme.muted(status)));
    console.log('\n');
  }

  if (footer) {
    console.log(center(theme.dim(footer)));
    console.log('\n');
  }
};
