import { NextFunction, Request, Response } from 'express';
import * as ServiceService from '../services/service.service';
import { formatResponse } from '../utils/responseFormatter';

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await ServiceService.getAllServices();
    res.status(200).json(formatResponse(true, services));
  } catch (error) {
    next(error);
  }
};

export const addService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newService = await ServiceService.createService(req.body);
    res.status(201).json(formatResponse(true, newService, 'Service added successfully'));
  } catch (error) {
    next(error);
  }
};

export const editService = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const updatedService = await ServiceService.updateService(id, req.body);
    res.status(200).json(formatResponse(true, updatedService, 'Service updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await ServiceService.deleteService(id);
    res.status(200).json(formatResponse(true, null, 'Service deleted successfully'));
  } catch (error) {
    next(error);
  }
};