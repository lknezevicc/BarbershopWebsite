import { Barber } from "./barber.model";
import { Service } from "./service.model";
import { User } from "./user.model";

export interface Appointment {
  _id: string;
  user: User;
  barber: Barber;
  service: Service;
  date: Date;
  slot: string;
  status: 'booked' | 'cancelled' | 'completed';
  createdAt: Date;
  cancelledAt?: Date;
  completedAt?: Date;
}