import { theme, center, getTerminalWidth, getTerminalHeight } from '../theme/theme.js';

const BRAILLE_ICON_FULL = [
  '    ⣠⣤⣄        ⢀⣤⣤⣄    ',
  ' ⣠⣴⣿⣿⣿⣿        ⢸⣿⣿⣿⣷⣦⣀ ',
  '⢸⣿⣿⣿⣿⠿⠋        ⠛⢿⣿⣿⣿⣿⡇',
  '⢸⣿⣿⣿⣏⠁              ⢈⣹⣿⣿⣿⡇',
  '⠘⣿⣿⣿⣿⣿⣦⣄        ⣠⣶⣿⣿⣿⣿⡿',
  ' ⠈⠙⠿⣿⣿⣿⣿        ⢸⣿⣿⣿⣿⠟⠋ ',
  '    ⠈⠙⠿⠛        ⠈⠻⠟⠋    ',
];

const BRAILLE_ICON_COMPACT = [
  '  ⢀⣤⣶⣷⡄  ⢰⣾⣶⣄⡀  ',
  ' ⢠⣾⣿⣿⣿⠿⠃  ⠘⢿⣿⣿⣿⣷⡄ ',
  ' ⠹⢿⣿⣿⣿⣦⡀  ⢠⣶⣿⣿⣿⡿⠃ ',
  '   ⠉⠻⢿⡿⠃  ⠸⣿⡿⠛⠁  ',
];

export const renderLogo = (forceVariant?: 'full' | 'compact' | 'braille' | 'dots'): string => {
  const height = getTerminalHeight();
  const width = getTerminalWidth();

  let icon = BRAILLE_ICON_FULL;
  if (forceVariant === 'compact' || (!forceVariant && (height < 22 || width < 60))) {
    icon = BRAILLE_ICON_COMPACT;
  }

  const colored = icon.map((line) => theme.brand(line)).join('\n');
  return center(colored, width);
};
