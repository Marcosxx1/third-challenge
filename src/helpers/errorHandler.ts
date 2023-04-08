import { Response } from 'express';

const handleErrorResponse = (
  res: Response<any, Record<string, any>>,
  error: any,
  status = 500, // Set default value to 500
): Response<any, Record<string, any>> => {
  const { message, details } = error;

  console.error(error);

  const errorResponse: any = {
    error: {
      message: message || 'Internal Server Error',
    },
  };
  if (details) {
    errorResponse.error.details = details;
  }
  return res.status(status).json(errorResponse);
};

export default handleErrorResponse;
