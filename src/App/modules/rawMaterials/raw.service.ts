import { ItemType, LogToRaw, RawMaterial } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TrawMaterial } from "./raw.types";

const createRawMaterial = async (payload: TrawMaterial) => {
  const isExist = await prisma.rawMaterial.findFirst({
    where: {
      name: payload?.name,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This name is already used");
  }
  const result = await prisma.$transaction(async (tx) => {
    const rawMeterial = await tx.rawMaterial.create({
      data: {
        name: payload.name,
        description: payload.description,
        unitId: payload.unitId,
      },
    });

    if (payload?.initialStock) {
      await tx.inventory.create({
        data: {
          rawId: rawMeterial.id,
          date: payload.initialStock.date,
          unitPrice: payload.initialStock.unitPrice,
          quantityAdd: payload.initialStock.quantity,
          isClosing: true,
          journal: {
            create: {
              debitAmount: Number(payload.initialStock.amount),
              narration: "Initial raw material",
            },
          },
        },
      });
    }
  });

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

const createLogtoRaw = async (payload: any) => {
  console.log(payload);

  const convertLog = await prisma.$transaction(async (tx) => {
    const inventoryData = payload?.items.map(
      (item: {
        rawId: number;
        unitPrice: number;
        quantity: number;
        date: Date;
        amount: number;
      }) => ({
        rawId: item.rawId,
        unitPrice: item.amount / item.quantity,
        quantityAdd: item.quantity,
        date: payload.date,
        journal: {
          create: {
            debitAmount: item.amount,
            narration: "Log converted to raw material",
          },
        },
      })
    );

    const logCategoryData = payload?.items.map(
      (item: {
        logCategoryId: number;
        unitPrice: number;
        quantity: number;
        date: Date;
        amount: number;
      }) => ({
        logCategoryId: item.logCategoryId,
        unitPrice: item.amount / item.quantity,
        quantityLess: item.quantity,
        date: payload.date,
        creditAmount: item.amount,
      })
    );

    const result = await prisma.logToRaw.create({
      data: {
        voucherNo: payload.voucherNo,
        date: payload.date,
        inventory: {
          create: inventoryData,
        },
        logOrdByCategory: {
          create: logCategoryData,
        },
      },
    });

    return result;
  });
};

export const RowMaterialsService = {
  createRawMaterial,
  getAllRawMaterial,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
  createLogtoRaw,
};
