import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "./product.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product create successfully",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.gerProduct();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Producties retrives successfully",
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ProductService.gerProductById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrives successfully",
    data: result,
  });
});

const updateProductById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ProductService.updateProductById(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product update successfully",
    data: result,
  });
});

const deleteProductById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await ProductService.deleteProductById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product delete successfully",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
