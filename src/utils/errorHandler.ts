import { Response } from 'express';
import { ErrorMessageMap } from '../constants/error-code';
import { ErrorCodeEnumType } from '../constants/error-code';

export const sendError = (
  res: Response,
  statusCode: number,
  code: ErrorCodeEnumType
) => {
  return res.status(statusCode).json({
    success: false,
    errorCode: code,
    message: ErrorMessageMap[code],
  });
};
