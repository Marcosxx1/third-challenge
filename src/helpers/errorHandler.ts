import { Response } from 'express';

const handleErrorResponse = (
  res: Response<any, Record<string, any>>,
  error: any,
): Response<any, Record<string, any>> => {
  const { message, errors, status = 500 } = error;

  console.error(error);

  const errorResponse: any = {
    error: {
      message: message || 'Internal Server Error',
    },
  };
  if (errors) {
    errorResponse.error.details = errors;
  }

  //const specificErrorMessage = errors && errors[0] && errors[0].message;

  return res.status(status).json(errorResponse);
};

export default handleErrorResponse;
