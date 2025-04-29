import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { LogCategoryService } from "./logCategory.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createLogGrate = catchAsync(async (req: Request, res: Response) => {
  const result = await LogCategoryService.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const getLogGrate = catchAsync(async (req: Request, res: Response) => {
  const result = await LogCategoryService.getAllLogCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log category retrived successfully",
    data: result,
  });
});

const LogCategoryControllers = {
  createLogGrate,
  getLogGrate,
};
