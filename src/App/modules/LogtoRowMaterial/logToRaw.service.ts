import { date, promise } from "zod";
import { StatusCodes } from "http-status-codes";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { LogCategory, LogToRaw } from "@prisma/client";

const createLogToRowIntoDB = async (payLoad: any) => {
  const createLogOrdrByCategory = await prisma.$transaction(async (tx) => {
    const isExistedLogCagetory = await Promise.all(
      payLoad?.logs?.map(
        async (log: { logCategoryId: number }) =>
          await tx.logCategory.findFirst({
            where: {
              id: log.logCategoryId,
            },
          })
      ) || []
    );

    const invalidCategory = isExistedLogCagetory.some(
      (category) => category === null
    );

    if (invalidCategory) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Log Category is not existed"
      );
    }

    const isExistedRaw = await Promise.all(
      payLoad?.logs?.map(
        async (log: { rawId: number }) =>
          await tx.rawMaterial.findFirst({
            where: {
              id: log.rawId,
            },
          })
      ) || []
    );

    const invalidrawMaterial = isExistedRaw.some((raw) => raw === null);

    if (invalidrawMaterial) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Raw Material is not existed"
      );
    }

    const createLogToRaw = await tx.logToRaw.create({
      data: {
        date: new Date(payLoad.date),
        voucherNo: payLoad.vaucher,
      },
    });

    const logOrderByCategoryData = await Promise.all(
      payLoad?.logs?.map(
        async (log: {
          logCategoryId: number;
          amount: number;
          quantity: number;
          rawId: number;
        }) => ({
          logCategoryId: log.logCategoryId,
          logToRawId: createLogToRaw.id,
          date: new Date(payLoad.date),
          quantityLess: log.quantity,
          creditAmount: log.amount,
          unitPrice: Number((log.amount / log.quantity).toFixed(2)),
        })
      )
    );

    await tx.logOrdByCategory.createMany({
      data: logOrderByCategoryData,
    });

    // Create inventory with nested journal using individual create calls
    for (const log of payLoad.logs) {
      const unitPrice = Number((log.amount / log.quantity).toFixed(2));

      await tx.inventory.create({
        data: {
          date: new Date(payLoad.date),
          logToRawId: createLogToRaw.id,
          rawId: log.rawId,
          quantityAdd: log.quantity,
          unitPrice: unitPrice,
          journal: {
            create: {
              date: new Date(payLoad.date),
              creditAmount: log.amount,
              narration: "Log convert to raw material",
            },
          },
        },
      });
    }

    return createLogToRaw;
  });

  return await prisma.logToRaw.findFirst({
    where: {
      id: createLogOrdrByCategory.id,
      voucherNo: createLogOrdrByCategory.voucherNo,
    },
    include: {
      inventory: true,
      logOrdByCategory: true,
    },
  });
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

const updateLogCategoryById = async (id: number, payLoad: LogCategory) => {
  console.log(payLoad);
  const result = await prisma.logCategory.update({
    where: {
      id,
    },
    data: payLoad,
  });

  return result;
};

export const LogToRawService = {
  createLogToRowIntoDB,
  getAllLogCategory,
  getLogCategoryById,
  updateLogCategoryById,
};
