// Structured logger

type Level = 'info' | 'warn' | 'error' | 'debug';

function log(level: Level, msg: string, meta?: any) {
  const entry = { level, time: new Date().toISOString(), msg, ...(meta ? { meta } : {}) };
  if (level === 'error') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

export const logger = {
  info: (msg: string, meta?: any) => log('info', msg, meta),
  warn: (msg: string, meta?: any) => log('warn', msg, meta),
  error: (msg: string, meta?: any) => log('error', msg, meta),
  debug: (msg: string, meta?: any) => log('debug', msg, meta),
};
