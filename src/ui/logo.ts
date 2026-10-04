import { theme, center } from '../theme/theme.js';

const BRAILLE_ICON = [
  '    ⣠⣤⣄        ⢀⣤⣤⣄    ',
  ' ⣠⣴⣿⣿⣿⣿        ⢸⣿⣿⣿⣷⣦⣀ ',
  '⢸⣿⣿⣿⣿⠿⠋        ⠛⢿⣿⣿⣿⣿⡇',
  '⢸⣿⣿⣿⣏⠁              ⢈⣹⣿⣿⣿⡇',
  '⠘⣿⣿⣿⣿⣿⣦⣄        ⣠⣶⣿⣿⣿⣿⡿',
  ' ⠈⠙⠿⣿⣿⣿⣿        ⢸⣿⣿⣿⣿⠟⠋ ',
  '    ⠈⠙⠿⠛        ⠈⠻⠟⠋    ',
];

const DOTS_ICON = [
  '    .::::.            .::::.    ',
  '  .::\'   ::          ::   `::.  ',
  ' .::\'   .::\'          `::.   `::.',
  ' :::    ::\'            `::    :::',
  ' :::    ::              ::    :::',
  ' :::    `::.          .::\'    :::',
  ' `::.   `::.        .::\'   .::\' ',
  '   `::.   ::        ::   .::\'   ',
  '     `::::\'          `::::\'     ',
];

export const renderLogo = (variant: 'braille' | 'dots' = 'braille'): string => {
  const icon = variant === 'braille' ? BRAILLE_ICON : DOTS_ICON;
  const colored = icon.map((line) => theme.brand(line)).join('\n');
  return center(colored);
};
