import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

export const appointmentValidator = Joi.object({
  barber: Joi.string().required().messages({
    'any.required': 'Barber ID is required.',
  }),

  service: Joi.string().required().messages({
    'any.required': 'Service ID is required.',
  }),

  date: Joi.date().required().messages({
    'any.required': 'Appointment date is required.',
    'date.base': 'Appointment date must be a valid date.',
  }),

  slot: Joi.string()
  .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/)
  .required()
  .messages({
    'any.required': 'Time slot is required.',
    'string.pattern.base': 'Time slot must be in the format HH:MM.',
  }),

  status: Joi.string()
    .valid('booked', 'cancelled', 'completed')
    .default('booked')
    .messages({
      'any.only': 'Status must be one of the following: booked, cancelled, or completed.',
    }),
});

export interface IAppointment extends Document {
  user: mongoose.Schema.Types.ObjectId;
  barber: mongoose.Schema.Types.ObjectId;
  service: mongoose.Schema.Types.ObjectId;
  date: Date;
  slot: string;
  status: 'booked' | 'cancelled' | 'completed';
  createdAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}

const AppointmentSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  slot: { type: String, required: true },
  status: { type: String, enum: ['booked', 'cancelled', 'completed'], default: 'booked' },
  createdAt: { type: Date, default: Date.now },
  cancelledAt: { type: Date },
  completedAt: { type: Date }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);