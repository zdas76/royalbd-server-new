import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { LogCategoryService } from "./logCategory.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createLogCagetory = catchAsync(async (req: Request, res: Response) => {
  const result = await LogCategoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const getLogCagetory = catchAsync(async (req: Request, res: Response) => {
  const result = await LogCategoryService.getAllLogCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log category retrived successfully",
    data: result,
  });
});

const getLogCagetoryById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await LogCategoryService.getLogCategoryById(id);

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
    const result = await LogCategoryService.updateLogCategoryById(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Log category retrived successfully",
      data: result,
    });
  }
);

export const LogCategoryControllers = {
  createLogCagetory,
  getLogCagetory,
  getLogCagetoryById,
  updateLogCagetoryById,
};
