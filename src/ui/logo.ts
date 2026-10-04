import { theme, center, getTerminalWidth } from '../theme/theme.js';

const BRAND_LOGO = [
  '  ⢀⣠⣴⣾⣷⡄    ⢠⣾⣷⣦⣄⡀  ',
  '⢠⣶⣿⣿⣿⣿⠿⠃    ⠈⠻⣿⣿⣿⣿⣷⡄',
  '⣿⣿⣿⣿⣉            ⣉⣿⣿⣿⣿',
  '⠘⢿⣿⣿⣿⣿⣦⡀    ⢀⣴⣿⣿⣿⣿⠿⠃',
  '  ⠈⠙⠻⢿⡿⠃    ⠘⢿⡿⠟⠋⠁  ',
];

const COMPACT_LOGO = [
  '  ⢀⣤⣶⣷⡆    ⢠⣾⣷⣤⡀  ',
  '⢠⣾⣿⣿⣿⠿⠃    ⠘⠿⣿⣿⣿⣷⣄',
  '⠙⢿⣿⣿⣿⣶⡄    ⢠⣶⣿⣿⣿⡿⠋',
  '  ⠈⠛⢿⡿⠃    ⠸⢿⡿⠛⠁  ',
];

export const renderAnimatedLogo = (frame: number = 0, variant?: 'full' | 'compact' | 'braille' | 'dots'): string => {
  const width = getTerminalWidth();
  const icon = variant === 'compact' ? COMPACT_LOGO : BRAND_LOGO;

  const colored = icon.map((line, y) => {
    let out = '';
    for (let x = 0; x < line.length; x++) {
      const ch = line[x];
      if (ch === ' ') {
        out += ' ';
      } else {
        const phase = frame * 0.15 + (x * 0.12) - (y * 0.08);
        const r = Math.max(0, Math.min(255, Math.floor(Math.sin(phase) * 45 + 30)));
        const g = Math.max(0, Math.min(255, Math.floor(Math.sin(phase + 0.6) * 55 + 200)));
        const b = Math.max(0, Math.min(255, Math.floor(Math.cos(phase) * 55 + 200)));
        out += `\x1b[38;2;${r};${g};${b}m${ch}\x1b[0m`;
      }
    }
    return out;
  }).join('\n');

  return center(colored, width);
};

export const renderLogo = (variant?: 'full' | 'compact' | 'braille' | 'dots'): string => {
  const width = getTerminalWidth();
  const icon = variant === 'compact' ? COMPACT_LOGO : BRAND_LOGO;
  const colored = icon.map((line) => theme.brand(line)).join('\n');
  return center(colored, width);
};
