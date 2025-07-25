// src/config/logger.ts
import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // 'debug' en desarrollo, 'info' en prod
  format: combine(
    colorize({ all: true }), // Colores para los niveles de log en consola
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Marca de tiempo
    align(), // Alinea los logs
    logFormat // Usa nuestro formato personalizado
  ),
  transports: [
    new winston.transports.Console(), // Loguea a la consola
    // En producción, podrías añadir un transporte de archivo:
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [ // Manejo de excepciones no capturadas
    new winston.transports.Console()
  ],
  rejectionHandlers: [ // Manejo de promesas rechazadas no capturadas
    new winston.transports.Console()
  ]
});

export default logger;