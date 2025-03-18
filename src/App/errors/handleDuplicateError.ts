import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const errorMessage = match && match[1];

  const errorSources: TErrorSources = [
    { path: "", message: `${errorMessage} is already exists` },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleDuplicateError;
