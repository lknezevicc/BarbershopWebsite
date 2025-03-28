import Appointment from '../models/appointment';
import Barber from '../models/barber';
import { sendSMS } from '../utils/twilioClient';
import { getEndOfDay, getStartOfDay } from '../utils/dayTimeUtil';
import { generateSlots } from '../utils/slotGenerator';
import { IUser } from '../models/user';
import { CustomError } from '../utils/customError';

export const bookAppointment = async (barber: string, service: string, date: Date, slot: string, user: { _id: string; phone: string; firstName: string }) => {
  const existingAppointment = await Appointment.findOne({ barber, date, slot, status: 'booked' });

  if (existingAppointment) {
    throw new CustomError(400, 'The selected time slot is already booked.');
  }

  const appointment = new Appointment({
    user: user._id,
    barber,
    service,
    date,
    slot
  });

  await appointment.save();

  const message = `Dear ${user.firstName}, your appointment on ${date.toLocaleDateString()} at ${slot} has been successfully booked.`;
  await sendSMS(user.phone, message);

  return appointment;
};

export const cancelAppointment = async (appointmentId: string) => {
  const appointment = await Appointment.findById(appointmentId).populate<{ user: IUser }>('user');

  if (!appointment) {
    throw new CustomError(404, 'Appointment not found');
  }

  appointment.status = 'cancelled';
  appointment.cancelledAt = new Date();
  await appointment.save();

  const user = appointment.user;
  const message = `Dear ${user.firstName}, your appointment on ${appointment.date.toLocaleDateString()} at ${appointment.slot} has been successfully cancelled.`;
  await sendSMS(user.phone, message);

  return 'Appointment cancelled';
};

export const completeAppointment = async (appointmentId: string) => {
  const appointment = await Appointment.findById(appointmentId).populate<{ user: IUser }>('user');
  if (!appointment) {
    throw new CustomError(404, 'Appointment not found');
  }

  appointment.status = 'completed';
  appointment.completedAt = new Date();
  await appointment.save();

  return 'Appointment completed';
}

export const getAppointmentsForBarberAndDate = async (barberId: string, date: Date) => {
  const appointments = await Appointment.find({
    barber: barberId,
    date: {
      $gte: getStartOfDay(date),
      $lt: getEndOfDay(date)
    }
  }).populate('service').populate('user');

  return appointments;
};

export const getAvailableSlots = async (barberId: string, date: Date) => {
  const barber = await Barber.findById(barberId);

  if (!barber) {
    throw new CustomError(404, 'Barber not found');
  }

  const startOfDay = getStartOfDay(date);
  const endOfDay = getEndOfDay(date);
  const slots = generateSlots(barber, date);

  const bookedAppointments = await Appointment.find({
    barber: barber._id,
    date: { $gte: startOfDay, $lt: endOfDay },
    status: 'booked'
  });

  const bookedSlots = bookedAppointments.map(appointment => appointment.slot);
  const availableSlots = slots.filter(slot => !bookedSlots.includes(slot));

  return availableSlots;
};

export const getAllAppointments = async () => {
  return await Appointment.find().populate('service');
};

export const getUserAppointments = async (userId: string) => {
  return await Appointment.find({ user: userId }).populate('service');
};