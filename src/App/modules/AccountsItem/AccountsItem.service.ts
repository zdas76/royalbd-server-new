import { AccountsItem } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";

const createAccountsItemtoDB = async (payLoad: AccountsItem) => {
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

const getAccountsItemFromDB = async (payLoad: string) => {
  let filerValue = {};

  if (payLoad) {
    const filer = JSON.parse(payLoad).map((id: string) => {
      return { accountMainPillerId: id };
    });
    console.log(filer);
    filerValue = {
      OR: filer,
    };
  }

  const result = await prisma.accountsItem.findMany({
    where: filerValue,
    orderBy: {
      accountMainPillerId: "asc",
    },
    include: {
      accountsPiler: true,
    },
  });
  return result;
};

const getAccountsItemByIdFromDB = async (id: number) => {
  const result = await prisma.accountsItem.findFirst({
    where: { id },
    include: {
      accountsPiler: true,
    },
  });
  return result;
};

const updateAccountsItemFromDBbyId = async (
  id: number,
  payLoad: AccountsItem
) => {
  const result = await prisma.accountsItem.update({
    where: { id },
    data: payLoad,
  });
  return result;
};

export const AccountItemService = {
  createAccountsItemtoDB,
  getAccountsItemFromDB,
  getAccountsItemByIdFromDB,
  updateAccountsItemFromDBbyId,
};
