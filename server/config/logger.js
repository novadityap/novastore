import winston from 'winston';
import 'winston-daily-rotate-file';

const customJsonFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
  winston.format.errors({ stack: true }),
  winston.format.json() 
);

const logger = winston.createLogger({
  level: 'info',
  format: customJsonFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: customJsonFormat
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

export default logger;
