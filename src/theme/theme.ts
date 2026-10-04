import chalk from 'chalk';
import gradient from 'gradient-string';

const brandGradient = gradient(['#00FFA3', '#00F0FF', '#38BDF8', '#818CF8']);
const cyanGradient = gradient(['#00FFA3', '#00F0FF']);

export const theme = {
  brand: brandGradient,
  cyan: cyanGradient,
  text: chalk.hex('#F8FAFC'),
  muted: chalk.hex('#64748B'),
  subtle: chalk.hex('#94A3B8'),
  dim: chalk.hex('#475569'),
  accent: chalk.hex('#00F0FF').bold,
  code: chalk.hex('#FFFFFF').bold,
  success: chalk.hex('#10B981'),
  warning: chalk.hex('#F59E0B'),
  error: chalk.hex('#EF4444'),
};

export const getTerminalWidth = (): number => {
  return process.stdout.columns && process.stdout.columns > 20 ? process.stdout.columns : 80;
};

export const stripAnsi = (str: string): string => {
  return str.replace(/\u001b\[[0-9;]*m/g, '');
};

export const center = (text: string, width: number = getTerminalWidth()): string => {
  return text
    .split('\n')
    .map((line) => {
      const clean = stripAnsi(line);
      const padding = Math.max(0, Math.floor((width - clean.length) / 2));
      return ' '.repeat(padding) + line;
    })
    .join('\n');
};
