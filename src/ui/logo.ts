import { theme, center, getTerminalWidth } from '../theme/theme.js';

const DOTS_LOGO = [
  "       .:::.           .:::.",
  "    .:'  .::           ::.  `:. ",
  "  .:'  .::'             `::.  `:. ",
  " ::   ::'                 `::   ::",
  " ::   ::                   ::   ::",
  " ::   `::.               .::'   ::",
  "  `:.  `::.             .::'  .:' ",
  "    `:.  `::           ::'  .:' ",
  "       `:::'           `:::'",
];

const COMPACT_DOTS_LOGO = [
  "   .::.     .::. ",
  " .:' `::   ::' `:. ",
  " ::   ::   ::   ::",
  "  `:.::'   `::.:' ",
];

export const renderLogo = (variant?: 'full' | 'compact' | 'braille' | 'dots'): string => {
  const width = getTerminalWidth();
  const icon = variant === 'compact' ? COMPACT_DOTS_LOGO : DOTS_LOGO;
  const colored = icon.map((line) => theme.subtle(line)).join('\n');
  return center(colored, width);
};
