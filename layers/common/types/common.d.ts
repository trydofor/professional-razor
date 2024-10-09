export interface DataResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}
