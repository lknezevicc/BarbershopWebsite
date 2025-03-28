import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/responseFormatter';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json(formatResponse(false, null, err.message));
};