import { format } from "date-fns";

export const formatPPpp = (date: string) => {
  return format(date, "PPpp");
};
export const formatPP = (date: string) => {
  return format(date, "PP");
};
