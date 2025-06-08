import { BankAccount, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { date } from "zod";
import { TBankAccount } from "./bank.types";

const createBankAccount = async (payload: TBankAccount) => {
  //check account number isExisted
  const accountExisted = await prisma.bankAccount.findFirst({
    where: {
      bankName: payload.bankName,
      accountNumber: payload.accountNumber,
    },
  });

  if (accountExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This account already existed");
  }

  const accountData = {
    bankName: payload.bankName,
    branceName: payload.branceName,
    accountNumber: payload.accountNumber,
  };
  const result = await prisma.bankAccount.create({
    data: accountData,
  });

  if (payload?.initialBalance) {
    await prisma.bankTransaction.create({
      data: {
        bankAccountId: result.id,
        date: payload?.date,
        debitAmount: payload?.initialBalance,
      },
    });
  }

  return result;
};

const getAllBankAccount = async () => {
  const result = await prisma.bankAccount.findMany({});

  return result;
};

const getBankAccountById = async (id: number) => {
  const result = await prisma.bankAccount.findFirst({
    where: { id },
  });

  return result;
};

const updateAccountInfo = async (id: number, payload: Partial<BankAccount>) => {
  //check account number isExisted
  const accountExisted = await prisma.bankAccount.findFirst({
    where: { id },
  });

  if (!accountExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Account Found");
  }

  const result = await prisma.bankAccount.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const BankAccountService = {
  createBankAccount,
  getAllBankAccount,
  getBankAccountById,
  updateAccountInfo,
};
