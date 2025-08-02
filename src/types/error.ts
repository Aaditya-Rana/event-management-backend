import { ErrorCodeEnum } from '../constants/error-code';

export class ApiError extends Error {
  public statusCode: number;
  public code: keyof typeof ErrorCodeEnum;

  constructor(statusCode: number, code: keyof typeof ErrorCodeEnum) {
    super(ErrorCodeEnum[code]);
    this.statusCode = statusCode;
    this.code = code;
  }
}
