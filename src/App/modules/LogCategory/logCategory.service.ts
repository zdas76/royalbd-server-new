import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { LogCategory } from "@prisma/client";

const createCategoryIntoDB = async (payLoad: LogCategory) => {
  //   const result = await prisma;
  const isExisted = await prisma.logCategory.findFirst({
    where: {
      name: payLoad.name,
    },
  });

  if (isExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name already existed");
  }

  const result = await prisma.logCategory.create({
    data: payLoad,
  });

  return result;
};

const getAllLogCategory = async () => {
  const result = await prisma.logCategory.findMany();

  return result;
};

const getLogCategoryById = async (id: number) => {
  const result = await prisma.logCategory.findMany({
    where: {
      id,
    },
  });

  return result;
};

const getUpdateLogCategoryById = async (id: number, payLoad: LogCategory) => {
  const result = await prisma.logCategory.update({
    where: {
      id,
    },
    data: payLoad,
  });

  return result;
};

export const LogCategoryService = {
  createCategoryIntoDB,
  getAllLogCategory,
  getLogCategoryById,
  getUpdateLogCategoryById,
};
