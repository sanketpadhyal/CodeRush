import { theme, center, getTerminalWidth } from '../theme/theme.js';

const BRAND_LOGO = [
  '      ⣠⣤⣄        ⢀⣤⣤⣄      ',
  '   ⣠⣴⣿⣿⣿⣿        ⢸⣿⣿⣿⣷⣦⣀   ',
  ' ⢠⣾⣿⣿⣿⣿⠿⠋        ⠛⢿⣿⣿⣿⣿⣷⡀ ',
  ' ⢸⣿⣿⣿⣏⠁              ⢈⣹⣿⣿⣿⡇ ',
  ' ⠘⣿⣿⣿⣿⣿⣦⣄        ⣠⣶⣿⣿⣿⣿⡿⠁ ',
  '  ⠈⠙⠿⣿⣿⣿⣿        ⢸⣿⣿⣿⣿⠟⠋   ',
  '     ⠈⠙⠿⠛        ⠈⠻⠟⠋      ',
];

const COMPACT_LOGO = [
  '   ⢀⣤⣶⣷⡄  ⢰⣾⣶⣄⡀   ',
  ' ⢠⣾⣿⣿⣿⠿⠃  ⠘⢿⣿⣿⣿⣷⡄ ',
  ' ⠹⢿⣿⣿⣿⣦⡀  ⢠⣶⣿⣿⣿⡿⠃ ',
  '   ⠉⠻⢿⡿⠃  ⠸⣿⡿⠛⠁   ',
];

export const renderLogo = (variant?: 'full' | 'compact' | 'braille' | 'dots'): string => {
  const width = getTerminalWidth();
  const icon = variant === 'compact' ? COMPACT_LOGO : BRAND_LOGO;
  const colored = icon.map((line) => theme.brand(line)).join('\n');
  return center(colored, width);
};
