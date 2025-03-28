import User, { IUser } from "../models/user";
import { CustomError } from "../utils/customError";
import { formatPhoneNumber } from "../utils/phoneFormatter";

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const createUser = async (data: IUser) => {
  const { phone, ...rest } = data;

  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    throw new CustomError(400, "Invalid phone number format.");
  }

  const user = new User({ ...rest, phone: formattedPhone });
  return await user.save();
};

export const updateUser = async (id: string, data: IUser) => {
  const { phone, ...rest } = data;

  const formattedPhone = formatPhoneNumber(phone);
  if (!formattedPhone) {
    throw new CustomError(400, "Invalid phone number format.");
  }

  const updatedData = { ...rest, phone: formattedPhone };

  return await User.findByIdAndUpdate(id, updatedData, { new: true });
};

export const deleteUserById = async (id: string) => {
  return await User.findByIdAndDelete(id);
};

export const updateUserRole = async (id: string, role: string) => {
  return await User.findByIdAndUpdate(id, { role }, { new: true });
};

export const changeUserPassword = async (id: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError(404, "User not found");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new CustomError(400, "Invalid current password");
  }
  
  user.password = newPassword;
  await user.save();

  return user;
};