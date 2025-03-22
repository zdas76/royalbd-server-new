import { Category, SubCategory } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

const createSubCategoryToDB = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  if (subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.subCategory.create({
    data: {
      subCategoryName: payLoad.subCategoryName,
      categoryId: payLoad.categoryId,
    },
  });

  return result;
};

const getSubCategory = async (): Promise<SubCategory[] | SubCategory> => {
  const result = await prisma.subCategory.findMany({
    include: {
      category: true,
    },
  });

  return result;
};

const subCategoryUpdate = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  if (!subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.subCategory.update({
    where: {
      id: subCategory.id,
    },
    data: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  return result;
};

const getCategorybyId = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      id: payLoad.id,
    },
  });

  if (!subCategory) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.subCategory.findFirstOrThrow({
    where: {
      id: payLoad.id,
    },
  });

  return result;
};

export const SubCagetoryService = {
  createSubCategoryToDB,
  getSubCategory,
  subCategoryUpdate,
  getCategorybyId,
};
