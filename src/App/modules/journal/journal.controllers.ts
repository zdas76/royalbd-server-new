import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { JurnalService } from "./journal.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getAllVoucher = catchAsync(async (req: Request, res: Response) => {
  const result = await JurnalService.getAllVucher();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Purchase Received create successfully",
    data: result,
  });
});

const addPurcherReceived = catchAsync(async (req: Request, res: Response) => {
  const result = await JurnalService.createPurchestReceivedIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Purchase Received create successfully",
    data: result,
  });
});

const createSalseVoucher = catchAsync(async (req: Request, res: Response) => {
  const result = await JurnalService.createSalesVoucher(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Salse created successfully",
    data: result,
  });
});

const createReceiptdVoucher = catchAsync(
  async (req: Request, res: Response) => {
    const result = await JurnalService.createReceiptVoucher(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Receipt created successfully",
      data: result,
    });
  }
);

const createPaymentdVoucher = catchAsync(
  async (req: Request, res: Response) => {
    const result = await JurnalService.createPaymentVoucher(req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment created successfully",
      data: result,
    });
  }
);

export const JournalControllers = {
  addPurcherReceived,
  createSalseVoucher,
  createReceiptdVoucher,
  createPaymentdVoucher,
  getAllVoucher,
};
