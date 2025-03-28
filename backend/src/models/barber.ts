import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

const workingHoursValidator = Joi.object({
  day: Joi.string()
    .valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    .required()
    .messages({
      'any.required': 'Day is required.',
      'any.only': 'Day must be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.',
    }),

  start: Joi.string()
    .required()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm
    .messages({
      'any.required': 'Start time is required.',
      'string.pattern.base': 'Start time must be in HH:mm format.',
    }),

  end: Joi.string()
    .required()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
      'any.required': 'End time is required.',
      'string.pattern.base': 'End time must be in HH:mm format.',
    }),
});


export const barberValidator = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Barber name is required.',
  }),

  services: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      'any.required': 'Services are required.',
      'array.base': 'Services must be an array of service IDs.',
    }),

  workingHours: Joi.array()
    .items(workingHoursValidator)
    .required()
    .messages({
      'any.required': 'Working hours are required.',
      'array.base': 'Working hours must be an array of valid day and time objects.',
    }),
    
  about: Joi.string()
    .optional()
    .allow('')
});

export interface IWorkingHours {
  day: string;
  start: string;
  end: string;
}

export interface IBarber extends Document {
  name: string;
  services: mongoose.Schema.Types.ObjectId[];
  workingHours: IWorkingHours[];
  about?: string;
}

const WorkingHoursSchema: Schema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const BarberSchema: Schema = new Schema({
  name: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
  workingHours: [WorkingHoursSchema],
  about: { type: String, default: 'No biography.' },
});

export default mongoose.model<IBarber>('Barber', BarberSchema);