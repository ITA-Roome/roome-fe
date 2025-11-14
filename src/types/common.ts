export type CommonResponse<T> = {
  isSuccess: boolean;
  success: boolean;
  code: string;
  message: string;
  data?: T;
};
