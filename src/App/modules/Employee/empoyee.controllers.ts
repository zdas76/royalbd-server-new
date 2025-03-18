import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { EmployeeService } from "./employee.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { UserfiltersFields } from "./employee.constant";

const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.creatEmployeeToDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employee create successfully",
    data: result,
  });
});

const getEmployee = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserfiltersFields);
  const paginat = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await EmployeeService.getAllemployee(filters, paginat);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employees retrived Successfully",
    data: result,
  });
});

const getEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await EmployeeService.getEmployeeById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employee retrived Successfully",
    data: result,
  });
});

const updateEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await EmployeeService.updateEmployeeById(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employee retrived Successfully",
    data: result,
  });
});

const deleteEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await EmployeeService.deleteEmployeeById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Employee deleted Successfully",
    data: result,
  });
});

export const EmployeeControllers = {
  getEmployee,
  getEmployeeById,
  updateEmployeeById,
  createEmployee,
  deleteEmployeeById,
};
