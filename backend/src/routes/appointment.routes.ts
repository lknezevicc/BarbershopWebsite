import express from 'express';
import { protect, admin } from '../middlewares/auth.middleware';
import * as AppointmentController from '../controllers/appointment.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { appointmentValidator } from '../models/appointment';

const router = express.Router();

router.post('/', validateRequest(appointmentValidator), protect, AppointmentController.bookAppointment);
router.get('/', protect, AppointmentController.getAllAppointments);
router.get('/:barberId/slots', protect, AppointmentController.getAvailableSlots);
router.get('/barber-appointments', protect, admin, AppointmentController.getAppointmentsForBarberAndDate);
router.patch('/:id/cancel', protect, AppointmentController.cancelAppointment);
router.patch('/:id/complete', protect, admin, AppointmentController.completeAppointment);
router.get('/user/:userId', protect, AppointmentController. getUserAppointments);

export default router;