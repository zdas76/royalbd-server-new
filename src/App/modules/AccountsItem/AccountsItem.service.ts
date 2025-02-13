import { AccountsItem } from "@prisma/client";

const createAccountsItemtoDB = async (payLoad: AccountsItem) => {
  console.log("first", payLoad);
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
