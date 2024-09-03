import { format } from "date-fns";
export const dateFormat = (date: string, dformat: string) => {
  try {
    return format(new Date(date), dformat);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return "unknown";
  }
};
