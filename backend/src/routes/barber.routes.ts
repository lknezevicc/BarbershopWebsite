import express from 'express';
import { protect, admin } from '../middlewares/auth.middleware';
import * as BarberController from '../controllers/barber.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { barberValidator } from '../models/barber';

const router = express.Router();

router.get('/', BarberController.getBarbers);
router.post('/', validateRequest(barberValidator), protect, admin, BarberController.addBarber);
router.put('/:id', validateRequest(barberValidator), protect, admin, BarberController.editBarber);
router.delete('/:id', protect, admin, BarberController.deleteBarber);

export default router;