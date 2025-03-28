import express from 'express';
import * as AuthController from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { userValidator } from '../models/user';

const router = express.Router();

router.post('/register', validateRequest(userValidator), AuthController.register);
router.post('/login',  AuthController.login);

export default router;