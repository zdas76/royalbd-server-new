import { AccountsItem } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

const createAccountsItemtoDB = async (payLoad: AccountsItem) => {
  console.log(payLoad);
  const isExist = await prisma.accountsItem.findFirst({
    where: {
      accountMainPillerId: payLoad.accountMainPillerId,
      accountsItemId: payLoad.accountsItemId,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This item already exist");
  }

  const checkPiller = await prisma.accountMainPiller.findUnique({
    where: {
      pillerId: payLoad.accountMainPillerId,
    },
  });

  if (!checkPiller) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Accounts head not found");
  }
  const result = await prisma.accountsItem.create({
    data: payLoad,
  });

  return result;
};

const getAccountsItemFromDB = async (payLoad: AccountsItem) => {
  const result = await prisma.accountsItem.groupBy({
    by: ["accountMainPillerId"],
  });
  return result;
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
