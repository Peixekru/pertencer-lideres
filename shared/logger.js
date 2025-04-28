import { COLORS, ICONS, LABELS, LEVEL_COLORS } from './loggerConfig.js';
import stringifyArgs from './stringifyArgs.js';

// Captura onde foi chamado
function getCallerInfo() {
  const stack = new Error().stack;
  const lines = stack?.split('\n') || [];

  for (const line of lines) {
    if (!line.includes('logger.js')) {
      const match = line.match(/(?:at\s+)?(?:.*\()?(.+?):(\d+):(\d+)\)?/);
      if (match) {
        let filePath = match[1];
        const lineNumber = match[2];
        filePath = filePath.split('?')[0];
        return `${filePath.split('/').pop()}:${lineNumber}`;
      }
    }
  }

  return 'unknown';
}

function getPrefix(level, customIcon, customLabel) {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR');
  const caller = getCallerInfo();
  const [file, line] = caller.split(':');

  const icon = customIcon === null ? ICONS[level] : customIcon;
  const label = customLabel ?? LABELS[level] ?? level.toUpperCase();
  const color = LEVEL_COLORS[level] ?? COLORS.gray;

  const labelColored = `${color}${icon} [${label}]${COLORS.reset}`;
  const timeColored = `${COLORS.gray}[${time}]${COLORS.reset}`;
  const callerColored = `${COLORS.gray}[ ${COLORS.green}${file}${COLORS.gray}:${line} ]${COLORS.reset}`;

  return `${timeColored} ${labelColored} ${callerColored}`;
}

function print(level, icon, label, ...args) {
  const prefix = getPrefix(level, icon, label);
  console.log(`\n${prefix}`, ...args, '\n');
}

function printStringified(level, icon, label, ...args) {
  const prefix = getPrefix(level, icon, label);
  const formattedArgs = stringifyArgs(...args);
  const logMessage = `\n${prefix} ${formattedArgs.join('')}\n`;
  console.log(logMessage);
}

function printTable(level, icon, label, ...tables) {
  const prefix = getPrefix(level, icon, label);
  console.log(`\n\n${prefix}\n`);
  for (const table of tables) {
    console.table(table);
  }
  console.log(`\n\n`);
}

// Reset automático após log
function withReset(logFn) {
  return (...args) => {
    logFn(...args);
    logger.resetIcon().resetLabel();
  };
}

const logger = {
  customIcon: null,
  customLabel: null,

  icon(icon) {
    this.customIcon = icon;
    return this;
  },

  label(label) {
    this.customLabel = label;
    return this;
  },

  resetIcon() {
    this.customIcon = null;
    return this;
  },

  resetLabel() {
    this.customLabel = null;
    return this;
  },

  // Logs puros
  inf: withReset((...args) => print('info', logger.customIcon, logger.customLabel, ...args)),
  war: withReset((...args) => print('warn', logger.customIcon, logger.customLabel, ...args)),
  err: withReset((...args) => print('error', logger.customIcon, logger.customLabel, ...args)),
  deb: withReset((...args) => print('debug', logger.customIcon, logger.customLabel, ...args)),
  log: withReset((...args) => print('log', logger.customIcon, logger.customLabel, ...args)),

  // Logs com formatação stringified
  stInf: withReset((...args) => printStringified('info', logger.customIcon, logger.customLabel, ...args)),
  stWar: withReset((...args) => printStringified('warn', logger.customIcon, logger.customLabel, ...args)),
  stErr: withReset((...args) => printStringified('error', logger.customIcon, logger.customLabel, ...args)),
  stDeb: withReset((...args) => printStringified('debug', logger.customIcon, logger.customLabel, ...args)),
  stLog: withReset((...args) => printStringified('log', logger.customIcon, logger.customLabel, ...args)),

  // Logs com formatação em tabela
  tbInf: withReset((...args) => printTable('info', logger.customIcon, logger.customLabel, ...args)),
  tbWar: withReset((...args) => printTable('warn', logger.customIcon, logger.customLabel, ...args)),
  tbErr: withReset((...args) => printTable('error', logger.customIcon, logger.customLabel, ...args)),
  tbDeb: withReset((...args) => printTable('debug', logger.customIcon, logger.customLabel, ...args)),
  tbLog: withReset((...args) => printTable('log', logger.customIcon, logger.customLabel, ...args)),

  // Encadeamento com estado isolado
  st: (() => {
    let customIcon = null;
    let customLabel = null;

    return {
      icon(icon) {
        customIcon = icon;
        return this;
      },
      label(label) {
        customLabel = label;
        return this;
      },
      inf: (...args) => printStringified('info', customIcon, customLabel, ...args),
      war: (...args) => printStringified('warn', customIcon, customLabel, ...args),
      err: (...args) => printStringified('error', customIcon, customLabel, ...args),
      deb: (...args) => printStringified('debug', customIcon, customLabel, ...args),
      log: (...args) => printStringified('log', customIcon, customLabel, ...args),
    };
  })(),

  tb: (() => {
    let customIcon = null;
    let customLabel = null;

    return {
      icon(icon) {
        customIcon = icon;
        return this;
      },
      label(label) {
        customLabel = label;
        return this;
      },
      inf: (...args) => printTable('info', customIcon, customLabel, ...args),
      war: (...args) => printTable('warn', customIcon, customLabel, ...args),
      err: (...args) => printTable('error', customIcon, customLabel, ...args),
      deb: (...args) => printTable('debug', customIcon, customLabel, ...args),
      log: (...args) => printTable('log', customIcon, customLabel, ...args),
    };
  })(),
};

export default logger;
