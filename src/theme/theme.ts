import chalk from 'chalk';
import gradient from 'gradient-string';

const brandGradient = gradient(['#00FFA3', '#00F0FF', '#38BDF8']);
const cyanGradient = gradient(['#00FFA3', '#00F0FF']);

export const theme = {
  brand: brandGradient,
  cyan: cyanGradient,
  mint: chalk.hex('#00FFA3').bold,
  white: chalk.hex('#FFFFFF'),
  boldWhite: chalk.hex('#FFFFFF').bold,
  title: chalk.hex('#F8FAFC').underline,
  text: chalk.hex('#F1F5F9'),
  muted: chalk.hex('#64748B'),
  subtle: chalk.hex('#94A3B8'),
  dim: chalk.hex('#475569'),
  accent: chalk.hex('#00F0FF').bold,
  code: chalk.hex('#FFFFFF').bold,
  success: chalk.hex('#10B981'),
  warning: chalk.hex('#F59E0B'),
  error: chalk.hex('#EF4444'),
};

export const setTerminalTitle = (title: string = 'coderush'): void => {
  process.title = title;
  process.stdout.write(`\x1b]0;${title}\x07`);
  process.stdout.write(`\x1b]2;${title}\x07`);
  process.stdout.write(`\x1b]633;SetProperty=TaskName=${title}\x07`);
};

export const enableBlackBackground = (): void => {
  process.stdout.write('\x1b]11;#000000\x07');
};

export const resetTerminalBackground = (): void => {
  process.stdout.write('\x1b]111\x07');
};

export const getTerminalWidth = (): number => {
  return process.stdout.columns && process.stdout.columns > 20 ? process.stdout.columns : 80;
};

export const getTerminalHeight = (): number => {
  return process.stdout.rows && process.stdout.rows > 5 ? process.stdout.rows : 24;
};

export const stripAnsi = (str: string): string => {
  return str.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '');
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

export const centerBlock = (lines: string[], width: number = getTerminalWidth()): string => {
  const cleanLengths = lines.map((line) => stripAnsi(line).length);
  const maxLen = Math.max(...cleanLengths, 0);
  const margin = Math.max(0, Math.floor((width - maxLen) / 2));
  return lines.map((line) => (line.length === 0 ? '' : ' '.repeat(margin) + line)).join('\n');
};
