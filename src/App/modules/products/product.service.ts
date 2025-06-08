import { ItemType, Product } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TcreateProduct } from "./product.type";

const createProduct = async (payload: TcreateProduct) => {
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

  if (payload.initialStock) {
    await prisma.inventory.create({
      data: {
        productId: result.id,
        itemType: ItemType.PRODUCT,
        unitePrice: payload.initialStock.uniterPrice,
        quantityAdd: payload.initialStock.amount,
        date: payload.initialStock.date,
        Journal: {
          create: {
            debitAmount: payload.initialStock.amount,
            narration: "Initial Product Balance",
          },
        },
      },
    });
  }

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
