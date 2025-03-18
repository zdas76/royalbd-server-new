import { Product } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const createProduct = async (payload: Product) => {
  const isExist = await prisma.product.findFirst({
    where: {
      name: payload.name,
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This product is already existed"
    );
  }

  const result = await prisma.product.create({
    data: payload,
  });

  return result;
};

const gerProduct = async () => {
  const result = await prisma.product.findMany();

  return result;
};

const gerProductById = async (id: number) => {
  const result = await prisma.product.findFirst({
    where: {
      id: id,
    },
  });

  return result;
};

const updateProductById = async (id: number, payload: Partial<Product>) => {
  const isExist = await prisma.product.findFirst({
    where: { id: id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No product found");
  }

  const result = await prisma.product.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return result;
};

const deleteProductById = async (id: number) => {
  const isExist = await prisma.product.findFirst({
    where: { id: id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No product found");
  }

  const result = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const ProductService = {
  createProduct,
  gerProduct,
  gerProductById,
  updateProductById,
  deleteProductById,
};
