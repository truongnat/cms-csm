import { format, parse } from "date-fns";

export const DATE_FORMAT = "dd/MM/yyyy";

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "";
  try {
    return format(new Date(date), DATE_FORMAT);
  } catch {
    return "";
  }
};

export const parseDateString = (dateString: string): string => {
  try {
    const date = parse(dateString, DATE_FORMAT, new Date());
    return date.toISOString();
  } catch {
    return "";
  }
};

export const isValidDateFormat = (dateString: string): boolean => {
  if (!dateString) return false;
  try {
    const date = parse(dateString, DATE_FORMAT, new Date());
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};