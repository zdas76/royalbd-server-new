import { LogOrderItem, PartyType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const getAllOrder = async () => {
  const result = await prisma.logOrder.findMany();

  return result;
};
const createGradesOrder = async (payLoad: any) => {
  const creadtOrder = await prisma.$transaction(async (tx) => {
    const isSupplierExistd = await tx.party.findFirst({
      where: {
        id: payLoad.supplierId,
        partyType: PartyType.SUPPLIER,
      },
    });

    if (!isSupplierExistd) {
      throw new AppError(StatusCodes.NOT_FOUND, "Supplier not found");
    }

    const isLogGradesExisted = await payLoad.logOrderItem.map(
      async (item: LogOrderItem) => {
        if (item.logGradesId && item.addQuantity) {
          return await prisma.logGrades.findFirst({
            where: { id: item.logGradesId },
          });
        }
      }
    );

    if (!isLogGradesExisted) {
      throw new AppError(StatusCodes.NOT_FOUND, "Log grades item not found");
    }

    const orderData = {
      supplierId: payLoad.supplierId,
      chalanNo: payLoad.chalanNo || null,
      date: payLoad.date,
      voucherNo: payLoad.voucherNo,
    };

    const orderInfo = await tx.logOrder.create({
      data: orderData,
    });

    const orderItem = payLoad.logOrderItem.map((item: LogOrderItem) => ({
      logOrderId: orderInfo.id,
      logGradesId: item.logGradesId,
      radis: item.radis,
      height: item.height,
      addQuantity: item.addQuantity,
      u_price: item.u_price,
      debitAmount: item.debitAmount,
    }));

    const creadeOrderItem = await tx.logOrderItem.createMany({
      data: orderItem,
    });

    const debitJournalItem = payLoad.debitItem.map(
      (item: {
        logOrderId: number;
        accountsItemId: number;
        debitAmount: number;
        narration: string;
      }) => ({
        logOrderId: orderInfo.id,
        accountsItemId: item.accountsItemId,
        debitAmount: item.debitAmount,
        narration: item?.narration || "",
      })
    );

    if (!Array.isArray(payLoad.creditItem) || payLoad.creditItem.length === 0) {
      throw new Error("Invalid data: Credit item must be a non-empty");
    }

    const creditJournalItem = payLoad.creditItem.map(
      (item: {
        logOrderId: number;
        accountsItemId: number;
        creditAmount: number;
        narration: string;
      }) => ({
        logOrderId: orderInfo.id,
        accountsItemId: item.accountsItemId,
        creditAmount: item.creditAmount,
        narration: item?.narration || "",
      })
    );

    const journaData = [...debitJournalItem, ...creditJournalItem];

    const createJourna = await tx.journal.createMany({
      data: journaData,
    });

    return orderInfo.id;
  });

  const result = await prisma.logOrder.findFirst({
    where: {
      id: creadtOrder,
    },
    include: {
      orderItem: true,
      Journal: true,
    },
  });
  return result;
};

export const GradesOrderService = {
  createGradesOrder,
  getAllOrder,
};
