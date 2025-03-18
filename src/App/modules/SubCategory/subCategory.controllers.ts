import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SubCagetoryService } from "./subCategory.service";

const createSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCagetoryService.createSubCategoryToDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category create Successfully",
    data: result,
  });
});

const getSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCagetoryService.getSubCategory();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category retrived Successfully",
    data: result,
  });
});

const getSubCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCagetoryService.getCategorybyId(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category retrived Successfully",
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await SubCagetoryService.subCategoryUpdate(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category updated Successfully",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  getSubCategoryById,
};
