export type ResponsePayload<T> = {
  success: boolean;
  message: string;
  data?: T;
};
