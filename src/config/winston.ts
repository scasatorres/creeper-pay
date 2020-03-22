import { Request, Response } from 'express';
import { format, createLogger, transports } from 'winston';
import path from 'path';
import 'winston-daily-rotate-file';

const customFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const transport = new transports.DailyRotateFile({
  filename: '%DATE%.log',
  zippedArchive: true,
  dirname: path.join(__dirname, '../../logs'),
  maxFiles: '30d',
  json: true,
});

const logger = createLogger({
  level: 'verbose',
  format: format.combine(
    format.splat(),
    format.json(),
    format.timestamp(),
    customFormat,
  ),
  transports: [transport],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.splat(),
        format.json(),
        format.colorize(),
        customFormat,
      ),
    }),
  );
}

const customLogger = {
  info: (req: Request, uid: string, res: Response, error: any = '') => {
    logger.info(
      '%s - %s %s %s %s',
      `${uid ? uid : 'user'}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${error ? '- ' + error : ''}`,
    );
  },
  warn: (req: Request, uid: string, res: Response, error: any = '') => {
    logger.warn(
      '%s - %s %s %s %s',
      `${uid ? uid : 'user'}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${error ? '- ' + error : ''}`,
    );
  },
  error: (req: Request, uid: string, res: Response, error: any = '') => {
    logger.error(
      '%s - %s %s %s %s',
      `${uid ? uid : 'user'}`,
      req.method,
      req.originalUrl,
      res.statusCode,
      `${error ? '- ' + error : ''}`,
    );
  },
};

export { customLogger as logger };
