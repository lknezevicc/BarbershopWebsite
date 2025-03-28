import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

export const serviceValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required.',
  }),

  description: Joi.string().required().messages({
    'string.empty': 'Description is required.',
  }),

  price: Joi.number().required().messages({
    'number.base': 'Price must be a number.',
    'any.required': 'Price is required.',
  }),
});

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IService>('Service', ServiceSchema);