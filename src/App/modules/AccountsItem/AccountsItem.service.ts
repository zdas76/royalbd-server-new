import { AccountsItem } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createAccountsItemtoDB = async (payLoad: AccountsItem) => {
  const isExist = await prisma.accountsItem.findFirst({
    where: {
      accountMainPillerId: payLoad.accountMainPillerId,
      accountsItemName: payLoad.accountsItemId,
    },
  });

  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "This item already exist");
  }

  const result = await prisma.accountsItem.create({
    data: payLoad,
  });

  return result;
};

const getAccountsItemFromDB = async (payLoad: AccountsItem) => {
  console.log("first", payLoad);
};

const getAccountsItemByIdFromDB = async (payLoad: AccountsItem) => {
  console.log("first", payLoad);
};

const updateAccountsItemFromDBbyId = async (payLoad: AccountsItem) => {
  console.log("first", payLoad);
};

export const AccountItemService = {
  createAccountsItemtoDB,
  getAccountsItemFromDB,
  getAccountsItemByIdFromDB,
  updateAccountsItemFromDBbyId,
};
