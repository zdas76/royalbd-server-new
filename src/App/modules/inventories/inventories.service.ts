import { date } from "zod";
import {
  Inventory,
  ItemType,
  Journal,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryOptions } from "@prisma/client/runtime/library";

const createInventory = async (id: number, payload: Inventory[]) => {
  const checkData = payload.map((item) => {
    if (item.itemType == "RAW_MATERIAL") {
      return rawMaterialIsExist({ id: item.id });
    } else {
      return porductIsExist({ id: item.id });
    }
  });

  if (!checkData) {
    throw new AppError(StatusCodes.BAD_GATEWAY, "No Data found");
  }

  const result = await prisma.inventory.createMany({
    data: payload,
  });

  return result;
};

const getInventory = async () => {
  return await prisma.inventory.findMany({
    include: {
      Journal: true,
    },
  });
};

const getInventoryById = async (id: number) => {
  return await prisma.inventory.findFirst({
    where: {
      id,
    },
    include: {
      Journal: true,
      product: true,
      raWMaterial: true,
    },
  });
};

const getInventoryAggValueById = async (query: any) => {
  const result = await prisma.$queryRaw`
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  GROUP BY i.productId`;

  //   const startDate = "2025-06-01";
  //   const endDate = "2025-06-06";

  //   const result = await prisma.$queryRaw<
  //     Array<{
  //       productId: number | null;
  //       netQuantity: number;
  //       netJournalAmount: number;
  //     }>
  //   >(Prisma.sql`
  //   SELECT
  //     i.productId,
  //     SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
  //     SUM(IFNULL(j.debitAmount, 0) - IFNULL(j.creditAmount, 0)) AS netJournalAmount
  //   FROM inventories i
  //   LEFT JOIN journals j ON j.inventoryItemId = i.id
  //   WHERE DATE(i.createdAt) BETWEEN ${startDate} AND ${endDate}
  //   GROUP BY i.productId
  // `);

  return result;
};

const updateInventory = async (id: number, payload: Inventory) => {
  return await prisma.inventory.updateMany({
    where: {},
    data: {},
  });
};

const deleteInventory = async (id: number, payload: Inventory) => {
  return console.log("first");
};

export const InventoryService = {
  createInventory,
  getInventory,
  getInventoryById,
  getInventoryAggValueById,
  updateInventory,
  deleteInventory,
};

async function porductIsExist(data: object) {
  return await prisma.product.findFirst({
    where: data,
  });
}

async function rawMaterialIsExist(data: object) {
  return await prisma.rawMaterial.findFirst({
    where: data,
  });
}
