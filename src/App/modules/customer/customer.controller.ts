import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CustomerService } from "./customer.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getCustomer = catchAsync(async (req: Request, res: Response) => {
  const contactNumber = req.query.contact as string;

  const result = await CustomerService.getCustomer(contactNumber);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "contact Number get Successfully",
    data: result,
  });
});

export const CustomerControllers = {
  getCustomer,
};
