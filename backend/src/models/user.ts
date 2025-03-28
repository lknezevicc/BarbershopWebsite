import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

export const userValidator = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'any.required': 'First name is required.',
      'string.min': 'First name must be at least 2 characters long.',
      'string.max': 'First name cannot be longer than 100 characters.',
  }),

  lastName: Joi.string()
  .min(2)
  .max(100)
  .required()
  .messages({
    'any.required': 'Last name is required.',
    'string.min': 'Last name must be at least 2 characters long.',
    'string.max': 'Last name cannot be longer than 100 characters.',
  }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'any.required': 'Email is required.',
      'string.email': 'Please provide a valid email address.',
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^(?:\+385|09)[0-9]{8,9}$/)
    .required()
    .messages({
      'any.required': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be valid.',
  }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'any.required': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
    }),
});

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);