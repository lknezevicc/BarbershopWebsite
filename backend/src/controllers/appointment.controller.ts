import { NextFunction, Request, Response } from 'express';
import * as AppointmentService from '../services/appointment.service';
import { formatResponse } from '../utils/responseFormatter';

export const bookAppointment = async (req: Request, res: Response, next: NextFunction) => {
  const { barber, service, date, slot } = req.body;

  try {
    if (!req.user) {
      res.status(401).json(formatResponse(false, null, 'User not authenticated'));
      return;
    }

    const user = req.user as { _id: string; phone: string; firstName: string };

    const appointment = await AppointmentService.bookAppointment(
      barber,
      service,
      new Date(date),
      slot,
      user
    );

    res.status(201).json(formatResponse(true, appointment, 'Appointment booked successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await AppointmentService.getAllAppointments();
    res.status(200).json(formatResponse(true, appointments));
  } catch (error) {
    next(error);
  }
};

export const getUserAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await AppointmentService.getUserAppointments(req.params.userId);
    res.status(200).json(formatResponse(true, appointments));
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AppointmentService.cancelAppointment(req.params.id);
    res.status(200).json(formatResponse(true, null, result));
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AppointmentService.completeAppointment(req.params.id);
    res.status(200).json(formatResponse(true, null, result));
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsForBarberAndDate = async (req: Request, res: Response, next: NextFunction) => {
  const { barberId, date } = req.query;

  try {
    const appointments = await AppointmentService.getAppointmentsForBarberAndDate(barberId as string, new Date(date as string));
    res.status(200).json(formatResponse(true, appointments));
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  const { barberId } = req.params;
  const { date } = req.query;

  try {
    const availableSlots = await AppointmentService.getAvailableSlots(barberId, new Date(date as string));
    res.status(200).json(formatResponse(true, availableSlots));
  } catch (error) {
    next(error);
  }
};