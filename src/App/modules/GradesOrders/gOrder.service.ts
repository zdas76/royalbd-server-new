import { LogOrderItem, PartyType } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { TlogOrderItems } from "./order.types";

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

    const isLogGradesExisted = await Promise.all(
      payLoad.logOrderItem.map(async (item: LogOrderItem) => {
        if (item.logGradeId && item.quantity) {
          return await tx.logGrades.findFirst({
            where: { id: item.logGradeId },
          });
        }
        return null;
      })
    );

    if (isLogGradesExisted.some((item) => !item)) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        "One or more log grades not found"
      );
    }

    const orderInfo = await tx.logOrder.create({
      data: {
        supplierId: payLoad.supplierId,
        chalanNo: payLoad.chalanNo || null,
        date: payLoad.date,
        voucherNo: payLoad.voucherNo,
      },
    });

    const orderItem = payLoad.logOrderItem.map((item: TlogOrderItems) => ({
      logOrderId: orderInfo.id,
      logGradeId: item.logGradeId,
      radis: item.radis,
      height: item.height,
      quantity: item.quantity,
      u_price: item.u_price,
      amount: item.amount,
    }));

    const logRes = await tx.logOrderItem.createMany({
      data: orderItem,
    });

    const debitJournalItem = payLoad.debitItem
      .map(
        (item: {
          logOrderId: number;
          accountsItemId: number;
          debitAmount: number;
          narration: string;
        }) => {
          if (item.debitAmount && item.accountsItemId) {
            return {
              logOrderId: orderInfo.id,
              accountsItemId: item.accountsItemId,
              debitAmount: item.debitAmount,
              narration: item.narration || "",
              date: payLoad.date,
            };
          }
          return null;
        }
      )
      .filter(Boolean);

    console.log(debitJournalItem);

    if (debitJournalItem) {
      await Promise.all(
        debitJournalItem.map((journal: any) =>
          tx.journal.create({
            data: journal,
          })
        )
      );
    }

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
        date: payLoad.date,
      })
    );

    await tx.journal.createMany({
      data: creditJournalItem,
    });

    const logItemByCategoryData = payLoad.logItemsByCategory.map(
      (item: {
        logId: any;
        date: any;
        unitPriceByCategory: any;
        quantity: any;
        amount: any;
      }) => ({
        logOrderId: orderInfo.id,
        logCategoryId: item.logId,
        date: payLoad.date,
        quantityAdd: item.quantity,
        debitAmount: item.amount,
        unitPrice: item.unitPriceByCategory,
      })
    );

    await tx.logOrdByCategory.createMany({
      data: logItemByCategoryData,
    });

    const result = await tx.logOrder.findFirst({
      where: {
        id: orderInfo.id,
      },
      include: {
        logOrderItem: true,
        logOrdByCategory: true,
      },
    });
    return result;
  });

  return creadtOrder;
};

//Get Log Total value
const getLogTotalByCagetoryId = async (payLoad: any) => {
  const result = await prisma.$queryRaw`
  
SELECT 
i.logCategoryId,

 SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
 SUM(IFNULL(i.debitAmount, 0)- IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM log_order_by_category i
  WHERE i.logCategoryId = ${payLoad.logCategoryId} AND i.date >= ${new Date(
    payLoad.date
  )}
  GROUP BY i.logCategoryId`;

  return result;
};

export const GradesOrderService = {
  createGradesOrder,
  getAllOrder,
  getLogTotalByCagetoryId,
};
