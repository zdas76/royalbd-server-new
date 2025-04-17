import { AccountItemService } from "./AccountsItem.service";
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createAccountItem = catchAsync(async (req: Request, res: Response) => {
  const result = await AccountItemService.createAccountsItemtoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Accounts Item create Successfully",
    data: result,
  });
});

const getAccountItem = catchAsync(async (req: Request, res: Response) => {
  const query = req.query.pillerIds as string;

  const result = await AccountItemService.getAccountsItemFromDB(query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Accounts Item Retrived Successfully",
    data: result,
  });
});

const getAccountItemById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await AccountItemService.getAccountsItemByIdFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Accounts Item Retrived Successfully",
    data: result,
  });
});

const updateAccountItemById = catchAsync(
  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = await AccountItemService.updateAccountsItemFromDBbyId(
      id,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Accounts Item Retrived Successfully",
      data: result,
    });
  }
);

export const AccountItemController = {
  createAccountItem,
  getAccountItem,
  getAccountItemById,
  updateAccountItemById,
};
