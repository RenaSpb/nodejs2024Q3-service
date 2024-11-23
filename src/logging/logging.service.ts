import { Injectable, LogLevel } from '@nestjs/common';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggingService {
  private logger;
  private errorLogger;

  constructor() {
    const logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    const maxSize = process.env.MAX_LOG_SIZE || '10m';

    this.logger = createLogger({
      level: logLevel,
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          filename: path.join('logs', 'application-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize,
          maxFiles: '14d',
        }),
      ],
    });

    this.errorLogger = createLogger({
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.DailyRotateFile({
          filename: path.join('logs', 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxSize,
          maxFiles: '14d',
        }),
      ],
    });
  }

  logRequest(req: any) {
    this.logger.info('Incoming request', {
      url: req.url,
      method: req.method,
      query: req.query,
      body: req.body,
      headers: req.headers,
    });
  }

  logResponse(req: any, res: any, responseTime: number) {
    this.logger.info('Response sent', {
      url: req.url,
      method: req.method,
      statusCode: res.statusCode,
      responseTime,
    });
  }

  error(message: string, trace?: any) {
    this.errorLogger.error(message, { trace });
  }

  warn(message: string, context?: any) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: any) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: any) {
    this.logger.verbose(message, { context });
  }
}
