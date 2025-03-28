import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
  
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    const error = new Error('Not authorized as an admin');
    next(error);
  }
};