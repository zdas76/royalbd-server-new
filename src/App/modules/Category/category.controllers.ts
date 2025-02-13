import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CagetoryService } from "./category.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CagetoryService.createCategoryToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category create Successfully",
    data: result,
  });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CagetoryService.getCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category retrived Successfully",
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await CagetoryService.getCategorybyId(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category retrived Successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CagetoryService.categoryUpdate(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category updated Successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategory,
  updateCategory,
  getCategoryById,
};
