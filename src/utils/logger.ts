type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const log = (level: LogLevel, message: string, context?: unknown): void => {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context !== undefined && { context }),
  };
  if (level === 'ERROR') {
    console.error(JSON.stringify(entry));
  } else if (level === 'WARN') {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
};

export const logger = {
  info: (message: string, context?: unknown) => log('INFO', message, context),
  warn: (message: string, context?: unknown) => log('WARN', message, context),
  error: (message: string, context?: unknown) => log('ERROR', message, context),
  debug: (message: string, context?: unknown) => log('DEBUG', message, context),
};
