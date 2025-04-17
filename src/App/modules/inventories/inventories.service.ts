import { Inventory } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";

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
  return await prisma.inventory.findMany();
};

const getInventoryById = async (id: number) => {
  return await prisma.inventory.findFirst({
    where: {
      id,
    },
  });
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
