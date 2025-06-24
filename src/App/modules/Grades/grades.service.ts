import { LogGrades } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TLogGradesTypes } from "./grades.types";

const crateGradeIntoDB = async (payLoad: TLogGradesTypes) => {
  console.log(payLoad);
  const isExistCategory = await prisma.logCategory.findUnique({
    where: {
      id: payLoad.categoryId,
    },
  });

  if (!isExistCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No category name exist");
  }

  const isExistName = await prisma.logGrades.findFirst({
    where: {
      categoryId: payLoad.categoryId,
      gradeName: payLoad.gradeName,
    },
  });

  if (isExistName) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This grade name already exist"
    );
  }

  const result = await prisma.logGrades.create({
    data: payLoad,
  });

  if (payLoad.initialStock) {
    await prisma.logOrdByCategory.create({
      data: {
        logCategoryId: payLoad.categoryId,
        quantityAdd: payLoad.initialStock.quantity,
        debitAmount: payLoad.initialStock.amount,
        unitPrice: payLoad.initialStock.amount / payLoad.initialStock.quantity,
        date: payLoad.initialStock.date,
      },
    });
  }

  return result;
};

const getGradeFromToDB = async () => {
  const result = await prisma.logGrades.findMany({
    include: {
      logCategory: true,
    },
  });
  return result;
};

const getGradeFromToDBById = async (id: number) => {
  const result = await prisma.logGrades.findFirst({
    where: { id },
  });
  return result;
};

const updateGradeFromToDBById = async (
  id: number,
  payLoad: Partial<LogGrades>
) => {
  const isExistName = await prisma.logGrades.findFirst({
    where: {
      gradeName: payLoad.gradeName,
    },
  });

  if (!isExistName) {
    throw new AppError(StatusCodes.NOT_FOUND, "No grade name found");
  }

  const result = await prisma.logGrades.update({
    where: { id },
    data: payLoad,
  });
  return result;
};
export const GradesService = {
  crateGradeIntoDB,
  getGradeFromToDB,
  getGradeFromToDBById,
  updateGradeFromToDBById,
};
