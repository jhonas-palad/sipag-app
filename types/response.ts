export type SuccessResponseData<T> = {
  data: T | any;
  status: Response["status"];
};
