import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import handelZodError from "../errors/handelZorError";
import { ZodError } from "zod";
import AppError from "../errors/AppError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "Something went wrong!";
  let error = err;

  if (err instanceof ZodError) {
    const simplifedError = handelZodError(err);
    statusCode = simplifedError?.statusCode;
    message = simplifedError?.message;
    error = simplifedError.errorSources;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate error";
      error = err.meta;
    }
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    error = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    error = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  console.log({
    success: false,
    message,
    error,
  });

  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

export default globalErrorHandler;
