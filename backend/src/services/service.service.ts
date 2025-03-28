import Service, { IService } from '../models/service';

export const getAllServices = async () => {
  return await Service.find();
};

export const createService = async (data: IService) => {
  const service = await Service.create(data);
  return service;
};

export const updateService = async (id: string, data: IService) => {
  return await Service.findByIdAndUpdate(id, data, { new: true });
};

export const deleteService = async (id: string) => {
  await Service.findByIdAndDelete(id);
};