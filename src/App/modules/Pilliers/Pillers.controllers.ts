import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { PillersService } from "./Pillers.service";

const createPillers = catchAsync(async (req: Request, res: Response) => {
  const result = await PillersService.createPliersItemIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Accounts Head Create Successfuly",
    data: result,
  });
});

const getPillers = catchAsync(async (req: Request, res: Response) => {
  const result = await PillersService.getAllPillerItem();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Accounts Head retrived Successfuly",
    data: result,
  });
});

export const PillersControllers = {
  createPillers,
  getPillers,
};
