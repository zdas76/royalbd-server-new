import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { LogToRawService } from "./logToRaw.service";

const createLogCagetory = catchAsync(async (req: Request, res: Response) => {
  const result = await LogToRawService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const getLogCagetory = catchAsync(async (req: Request, res: Response) => {
  const result = await LogToRawService.getAllLogCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log category retrived successfully",
    data: result,
  });
});

const getLogCagetoryById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await LogToRawService.getLogCategoryById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log category retrived successfully",
    data: result,
  });
});

const updateLogCagetoryById = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await LogToRawService.updateLogCategoryById(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Log category retrived successfully",
      data: result,
    });
  }
);

export const LogtoRawControllers = {
  createLogCagetory,
  getLogCagetory,
  getLogCagetoryById,
  updateLogCagetoryById,
};
