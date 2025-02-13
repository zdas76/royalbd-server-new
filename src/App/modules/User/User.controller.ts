import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./User.Service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { UserfiltersFields } from "./User.constant";

const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.creatEmployeeToDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employee create successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.creatAdminToDB(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin create successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, UserfiltersFields);
  const paginat = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await UserService.getAllUserFromBD(filters, paginat);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Data fatched",
    meta: result.meta,
    data: result.data,
  });
});

export const UserControllers = {
  createEmployee,
  createAdmin,
  getAllUser,
};
