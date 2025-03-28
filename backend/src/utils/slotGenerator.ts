import { IBarber } from '../models/barber';
import { IWorkingHours } from '../models/barber';

export const generateSlots = (barber: IBarber, date: Date): string[] => {
  const slots: string[] = [];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekName = daysOfWeek[date.getDay()];

  const workingHour = barber.workingHours.find((wh: IWorkingHours) => wh.day === dayOfWeekName);

  if (workingHour) {
    const startTime = setTime(date, workingHour.start);
    const endTime = setTime(date, workingHour.end);
    let currentTime = new Date(startTime);

    while (currentTime < endTime) {
      slots.push(formatTime(currentTime));
      currentTime = addMinutes(currentTime, 30);
    }
  }

  return slots;
};

const setTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};