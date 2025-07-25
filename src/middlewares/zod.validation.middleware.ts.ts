// src/middlewares/zod.validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { Logger } from 'winston';
import { container } from '../config/inversify.config.js';
import { TYPES } from '../config/types.js';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const logger = container.get<Logger>(TYPES.Logger);
    try {
      schema.parse(req.body); // Intenta parsear y validar el cuerpo de la solicitud
      next(); // Si la validación es exitosa, pasa al siguiente middleware
    } catch (error: any) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        logger.warn(`Validation failed for request to ${req.path}: ${validationError.message}`);
        return res.status(400).json({
          message: 'Validation failed',
          errors: validationError.details.map((detail :any) => detail.message)
        });
      }
      logger.error(`Unexpected validation error for request to ${req.path}:`, error);
      return res.status(500).json({ message: 'Internal server error during validation.' });
    }
  };
};