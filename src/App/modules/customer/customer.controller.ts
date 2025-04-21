import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { CustomerService } from "./customer.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const contactNumber = req.query.contactNumber as string;

  const result = await CustomerService.getCustomerById(contactNumber);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category create Successfully",
    data: result,
  });
});

export const CustomerControllers = {
  getCustomerById,
};
