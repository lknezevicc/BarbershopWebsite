import Barber, { IBarber } from "../models/barber";
import Service from "../models/service";
import { ObjectId } from "mongoose";
import { CustomError } from "../utils/customError";

export const addBarber = async (data: IBarber) => {
  const { services } = data;

  await validateServices(services);

  return await Barber.create(data);
};

export const editBarber = async (id: string, data: IBarber) => {
  const { services } = data;

  const barber = await Barber.findById(id);
  if (!barber) {
    throw new CustomError(404, 'Barber not found.');
  }

  await validateServices(services);

  return await Barber.findByIdAndUpdate(id, data, { new: true });
};


export const getBarbers = async () => {
  return await Barber.find().populate('services');
};

export const deleteBarber = async (id: string) => {
  const barber = await Barber.findById(id);
  if (!barber) {
    throw new CustomError(404, 'Barber not found.');
  }

  await barber.deleteOne();
};

const validateServices = async (services: ObjectId[]) => {
  if (!services || services.length === 0) {
    throw new CustomError(400, 'Services are required.');
  }

  const servicesExist = await Service.find({ _id: { $in: services } });
  if (services.length !== servicesExist.length) {
    throw new CustomError(400, 'One or more services do not exist.');
  }
};