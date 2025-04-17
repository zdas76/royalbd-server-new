import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { BankTransactionService } from "./transaction.service";

const getAllBankAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await BankTransactionService.getAllTransaction();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Bank Accounts retrives successfully",
    data: result,
  });
});

const getBankAccountById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await BankTransactionService.getTransactionById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Bank Account retrives successfully",
    data: result,
  });
});

export const transactionControllers = {
  getAllBankAccount,
  getBankAccountById,
};
