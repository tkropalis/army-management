export const parseDate = (dateStr: string): Date => {
  const [day, month] = dateStr.split('/');
  return new Date(2025, parseInt(month) - 1, parseInt(day));
};

export const isDateBetween = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};
