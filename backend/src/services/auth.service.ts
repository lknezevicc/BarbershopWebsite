import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomError } from '../utils/customError';
import { formatPhoneNumber } from '../utils/phoneFormatter';

dotenv.config();

export const registerUser = async (data: IUser) => {
  const { firstName, lastName, email, phone, password } = data;

  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    throw new CustomError(400, "Invalid phone number format.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new CustomError(400, 'User already exists');
  }

  await User.create({ firstName, lastName, email, phone: formattedPhone, password });
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError(404, 'User not found');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new CustomError(401, 'Invalid password');
  }

  const token = generateToken(user._id as string, user.role);

  return token;
};

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '2d' });
};