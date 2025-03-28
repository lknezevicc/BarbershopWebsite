import { Service } from "./service.model";

export interface WorkingHours {
  day: string;
  start: string;
  end: string;
}

export interface Barber {
  _id: string;
  name: string;
  services: Service[];
  workingHours: WorkingHours[];
  about?: string;
}