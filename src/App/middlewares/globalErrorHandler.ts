import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import handelZodError from "../errors/handelZorError";
import { ZodError } from "zod";
import AppError from "../errors/AppError";
import config from "../../config";

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

  if (error instanceof ZodError) {
    const simplifedError = handelZodError(error);
    statusCode = simplifedError?.statusCode;
    message = simplifedError?.message;
    error = simplifedError?.errorSources;
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    message = "Validation Error";
    error = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      message = "Duplicate Key error";
      error = err.meta;
    }
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    error = [
      {
        path: "",
        message: error.message,
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    error = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: [
      {
        path: "",
        message: error.message,
      },
    ],
  });
};

export default globalErrorHandler;
