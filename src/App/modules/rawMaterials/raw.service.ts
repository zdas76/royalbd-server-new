import { ItemType, RawMaterial } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TrawMaterial } from "./raw.types";

const createRawMaterial = async (payload: TrawMaterial) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name is already used");
  }

  const result = await prisma.rawMaterial.create({
    data: payload,
  });

  if (payload.initialStock) {
    await prisma.inventory.create({
      data: {
        rawId: result.id,
        itemType: ItemType.RAW_MATERIAL,
        unitePrice: payload.initialStock.uniterPrice,
        quantityAdd: payload.initialStock.amount,
        date: payload.initialStock.date,
        Journal: {
          create: {
            debitAmount: payload.initialStock.amount,
            narration: "Initial raw material balance",
          },
        },
      },
    });
  }

  return result;
};

const getAllRawMaterial = async () => {
  const result = await prisma.rawMaterial.findMany();

  return result;
};

const getRawMaterialById = async (id: number) => {
  const result = await prisma.rawMaterial.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateRawMaterial = async (id: number, payload: Partial<RawMaterial>) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: { id },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No material found");
  }

  const result = await prisma.rawMaterial.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteRawMaterial = async (id: number) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No material found");
  }

  const result = await prisma.rawMaterial.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const RowMaterialsService = {
  createRawMaterial,
  getAllRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};
