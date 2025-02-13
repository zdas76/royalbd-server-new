import { Category, SubCategory } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createSubCategoryToDB = async (payLoad: SubCategory) => {
  console.log(payLoad);

  const subCategory = await prisma.subCategory.findFirst({
    where: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  if (subCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This Name already used");
  }

  const result = await prisma.subCategory.create({
    data: {
      subCategoryName: payLoad.subCategoryName,
      categorryId: payLoad.categorryId,
    },
  });

  return result;
};

const getSubCategory = async (): Promise<SubCategory[] | SubCategory> => {
  const result = await prisma.subCategory.findMany();

  return result;
};

const subCategoryUpdate = async (payLoad: SubCategory) => {
  const subCategory = await prisma.subCategory.findFirst({
    where: {
      subCategoryName: payLoad.subCategoryName,
    },
  });

  if (!subCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This Name already used");
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
    throw new ApiError(StatusCodes.BAD_REQUEST, "This Name already used");
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
