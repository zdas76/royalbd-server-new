import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";

const createInventory = catchAsync(async (req: Request, res: Response) => {
  return console.log("first");
});

const getnventory = catchAsync(async (req: Request, res: Response) => {
  return console.log("first");
});

const getInventoryById = catchAsync(async (req: Request, res: Response) => {
  return console.log("first");
});

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  return console.log("first");
});

const deleteInventory = catchAsync(async (req: Request, res: Response) => {
  return console.log("first");
});

export const InventoryControllers = {
  createInventory,
  getnventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
