import { date } from "zod";
import { Inventory } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

const getInventory = async () => {
  return await prisma.inventory.findMany({
    include: {
      journal: true,
    },
  });
};

const getInventoryById = async (id: number) => {
  return await prisma.inventory.findFirst({
    where: {
      id,
    },
    include: {
      journal: true,
      product: true,
      raWMaterial: true,
    },
  });
};

const getInventoryAggValueById = async (query: any) => {
  console.log(query);

  if (query.itemType === "product") {
    const getDate = await prisma.inventory.findFirst({
      where: {
        productId: Number(query.productId),
        isClosing: true,
      },

      orderBy: [{ id: "desc" }],
    });

    console.log(getDate);

    if (!getDate?.date) {
      throw new AppError(StatusCodes.NOT_FOUND, "date not found");
    }

    const result = await prisma.$queryRaw`
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  WHERE i.productId = ${query.productId} AND i.date=${getDate?.date}
  GROUP BY i.productId`;

    return result;
  }

  if (query.itemType === "raw") {
    const getDate = await prisma.inventory.findFirst({
      where: {
        rawId: Number(query.rawId),
        isClosing: true,
      },

      orderBy: [{ id: "desc" }],
    });

    console.log(getDate);

    if (!getDate?.date) {
      throw new AppError(StatusCodes.NOT_FOUND, "date not found");
    }

    const result = await prisma.$queryRaw`
  SELECT 
    i.rawId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0) - IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  WHERE i.rawId = ${query.rawId} AND i.date=${getDate?.date}
  GROUP BY i.rawId`;

    return result;
  }
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
