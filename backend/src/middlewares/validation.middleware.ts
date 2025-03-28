import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {

    if (['POST', 'PUT'].includes(req.method)) {
      const validationResult = schema.validate(req.body);
      
      if (validationResult.error) {
        const error = new Error(validationResult.error.details[0].message);
        error.name = 'ValidationError';
        next(error);
      }
    }

    next();
  };
};