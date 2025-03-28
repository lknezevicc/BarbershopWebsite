import { Request, Response, NextFunction } from "express";
import * as BarberService from "../services/barber.service";
import { formatResponse } from "../utils/responseFormatter";

export const addBarber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const barber = await BarberService.addBarber(req.body);
    res.status(201).json(formatResponse(true, barber, "Barber added successfully"));
  } catch (error) {
    next(error);
  }
};

export const editBarber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const barber = await BarberService.editBarber(id, req.body);

    res.status(200).json(formatResponse(true, barber, "Barber updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getBarbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const barbers = await BarberService.getBarbers();
    res.status(200).json(formatResponse(true, barbers));
  } catch (error) {
    next(error);
  }
};

export const deleteBarber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await BarberService.deleteBarber(id);
    res.status(200).json(formatResponse(true, null, "Barber deleted successfully"));
  } catch (error) {
    next(error);
  }
};