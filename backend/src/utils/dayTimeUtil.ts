const setDayTime = (date: Date, hours: number, minutes: number, seconds: number, milliseconds: number): Date => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, seconds, milliseconds);
  return newDate;
};

export const getStartOfDay = (date: Date): Date => setDayTime(date, 0, 0, 0, 0);

export const getEndOfDay = (date: Date): Date => setDayTime(date, 23, 59, 59, 999);