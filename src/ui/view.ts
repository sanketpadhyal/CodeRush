import { theme, center } from '../theme/theme.js';
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
    badge,
    subtitle,
    instructions,
    status,
    footer = 'ctrl+c  quit',
    logoVariant = 'braille',
  } = options;

  console.clear();
  console.log('\n');
  console.log(renderLogo(logoVariant));
  console.log('\n');

  if (title) {
    console.log(center(theme.text(title)));
    console.log('');
  }

  if (badge) {
    console.log(center(theme.code(badge)));
    console.log('');
  }

  if (subtitle) {
    console.log(center(theme.subtle(subtitle)));
    console.log('');
  }

  if (instructions && instructions.length > 0) {
    const formatted = instructions.map((inst) => theme.muted(inst)).join('\n');
    console.log(center(formatted));
    console.log('');
  }

  if (status) {
    console.log(center(theme.muted(status)));
    console.log('');
  }

  if (footer) {
    console.log(center(theme.dim(footer)));
    console.log('\n');
  }
};
