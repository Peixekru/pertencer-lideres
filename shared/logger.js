import { COLORS, LEVEL_CONFIG } from './loggerConfig.js';

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

function formatLog(level, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR');
  const caller = getCallerInfo();

  const { icon, color } = LEVEL_CONFIG[level] || { icon: '', color: COLORS.reset };

  const levelLabel = `${icon} [${level.toUpperCase()}]`;
  const coloredLevel = `${color}${levelLabel}${COLORS.reset}`;

  const [file, line] = caller.split(':');
  const fileAndLine =
    `${COLORS.gray}[ ${COLORS.green}${file}${COLORS.gray}:${line} ]${COLORS.reset}`;

  const timeLabel = `${COLORS.gray}[${time}]${COLORS.reset}`;

  return [`${timeLabel} ${coloredLevel} ${fileAndLine}`, ...args];
}

const logger = {
  inf: (...args) => console.log(...formatLog('info', ...args)),
  war: (...args) => console.log(...formatLog('warn', ...args)),
  err: (...args) => console.log(...formatLog('error', ...args)),
  deb: (...args) => console.log(...formatLog('debug', ...args)),
  log: (...args) => console.log(...formatLog('log', ...args)),

  preview: (...args) => {
    console.log(...formatLog('info', 'logger.inf - ', ...args))
    console.log(...formatLog('warn', 'logger.war - ', ...args))
    console.log(...formatLog('error', 'logger.err - ', ...args))
    console.log(...formatLog('debug', 'logger.deb - ', ...args))
    console.log(...formatLog('log', 'logger.log - ', ...args))
  }
};

export default logger;


/* Exemplo de uso:
logger.info('mensagem informativa');
logger.warn('mensagem de aviso');
logger.error('mensagem de erro');
logger.debug('mensagem de debug');
logger.log('mensagem genérica');
*/
