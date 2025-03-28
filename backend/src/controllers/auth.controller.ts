import { NextFunction, Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { formatResponse } from '../utils/responseFormatter';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.registerUser(req.body);
    res.status(201).json(formatResponse(true, null, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const token  = await AuthService.loginUser({ email, password });
    if (token) {
      res.status(200).json(formatResponse(true, { token }, 'Login successful'));
    } else {
      res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }
  } catch (error) {
    next(error);
  }
  
};