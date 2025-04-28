export const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[38;2;137;221;255m',
  yellow: '\x1b[38;2;254;202;106m',
  red: '\x1b[38;2;235;111;117m',
  magenta: '\x1b[38;2;199;146;234m',
  green: '\x1b[38;2;194;231;140m',
  gray: '\x1b[38;2;150;150;150m',
};

export const ICONS = {
  info: 'ⓘ',
  warn: '‼',
  error: '✖',
  debug: '⚙',
  log: '•',
};

export const LABELS = {
  info: 'INF',
  warn: 'WAR',
  error: 'ERR',
  debug: 'DBG',
  log: 'LOG',
};

export const LEVEL_COLORS = {
  info: COLORS.cyan,
  warn: COLORS.yellow,
  error: COLORS.red,
  debug: COLORS.magenta,
  log: COLORS.reset,
};
