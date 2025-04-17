import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error";

const handelZodError = (error: ZodError): TGenericErrorResponse => {
  let errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;

  return {
    statusCode,
    message: "Validation error",
    errorSources,
  };
};

export default handelZodError;
