// 🎨 Cores ANSI
export const COLORS = {
  reset: '\x1b[0m',
  gray: '\x1b[38;2;150;150;150m',
  green: '\x1b[38;2;194;231;140m',
  cyan: '\x1b[38;2;137;221;255m',
  yellow: '\x1b[38;2;254;202;106m',
  red: '\x1b[38;2;235;111;117m',
  magenta: '\x1b[38;2;199;146;234m',
};

/*
export const TITLE = {
  inf: 'inf',
  war: 'war',
  err: 'err',
  deb: 'deb',
  log: 'log',
};
*/

const ICONS = {
  info: 'i',
  warn: '‼',
  error: '✖',
  debug: '⚙',
  log: '•',
};

export const LEVEL_CONFIG = {
  info: { icon: ICONS.info, color: COLORS.cyan },
  warn: { icon: ICONS.warn, color: COLORS.yellow },
  error: { icon: ICONS.error, color: COLORS.red },
  debug: { icon: ICONS.debug, color: COLORS.magenta },
  log: { icon: ICONS.log, color: COLORS.reset },
};

/* 
export const ICONS = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🐞',
  log: '📝',
};
*/
