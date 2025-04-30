import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { GradesService } from "./grades.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

const createLogGrades = catchAsync(async (req: Request, res: Response) => {
  const result = await GradesService.crateGradeIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const getAllLogGrades = catchAsync(async (req: Request, res: Response) => {
  const result = await GradesService.getGradeFromToDB();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const getLogGradesById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await GradesService.getGradeFromToDBById(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

const updateLogGradesById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await GradesService.updateGradeFromToDBById(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Log Category created successfully",
    data: result,
  });
});

export const GradeControllers = {
  createLogGrades,
  getAllLogGrades,
  getLogGradesById,
  updateLogGradesById,
};
