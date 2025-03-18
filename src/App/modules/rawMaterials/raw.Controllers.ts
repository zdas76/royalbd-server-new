import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { RowMaterialsService } from "./raw.service";
import { StatusCodes } from "http-status-codes";

const createRawMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await RowMaterialsService.createRawMaterial(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "RawMaterial create successfully",
    data: result,
  });
});

const getAllRawMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await RowMaterialsService.getAllRawMaterial();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "RawMaterialies retrives successfully",
    data: result,
  });
});

const getRawMaterialById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const result = await RowMaterialsService.getRawMaterialById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "RawMaterial retrives successfully",
    data: result,
  });
});

const updateRawMaterialById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const result = await RowMaterialsService.updateRawMaterial(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "RawMaterial update successfully",
      data: result,
    });
  }
);

const deleteRawMaterialById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const result = await RowMaterialsService.deleteRawMaterial(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "RawMaterial delete successfully",
      data: result,
    });
  }
);

export const RawMaterialControllers = {
  createRawMaterial,
  getAllRawMaterial,
  getRawMaterialById,
  updateRawMaterialById,
  deleteRawMaterialById,
};
