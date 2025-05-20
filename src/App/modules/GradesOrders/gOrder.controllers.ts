import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { GradesOrderService } from "./gOrder.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await GradesOrderService.createGradesOrder(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Order created successfully",
    data: result,
  });
});

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await GradesOrderService.getAllOrder();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Order created successfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrder,
};
