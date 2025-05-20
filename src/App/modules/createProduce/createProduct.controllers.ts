import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CreateProductServices } from "./createProduct.service";

const createProductFromRowMaterial = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CreateProductServices.createProductInfo(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "RowMaterial convented to product successfully",
      data: result,
    });
  }
);

export const CreateProductControllers = {
  createProductFromRowMaterial,
};
