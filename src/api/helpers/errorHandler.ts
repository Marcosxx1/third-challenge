import { Response } from 'express';

const handleErrorResponse = (
  res: Response<any, Record<string, any>>,
  error: any,
): Response<any, Record<string, any>> => {
  const { message, errors, status = 500 } = error;

  console.error(error);

  let errorMessage = 'Validation failed: ';

  const fieldName = errors && Object.keys(errors)[0];
  const fieldError = fieldName && errors[fieldName];

  if (fieldName && fieldError && fieldError.message) {
    errorMessage += `${fieldName}: ${fieldError.message}`;
  } else {
    errorMessage += message;
  }

  const errorResponse: any = {
    error: {
      message: errorMessage,
    },
  };

  return res.status(400).json(errorResponse);
};

export default handleErrorResponse;
