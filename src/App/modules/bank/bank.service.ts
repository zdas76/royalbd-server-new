import { BankAccount, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { date } from "zod";
import { TBankAccount } from "./bank.types";

const createBankAccount = async (payload: TBankAccount) => {
  console.log("first", payload);
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

  const result = await prisma.$transaction(async (tx) => {
    const result = await tx.bankAccount.create({
      data: {
        bankName: payload.bankName,
        branceName: payload.branceName,
        accountNumber: payload.accountNumber,
      },
    });

    await tx.bankTransaction.create({
      data: {
        bankAccountId: result.id,
        date: new Date(payload.date),
        debitAmount: payload.initalAmount,
        isClosing: true,
      },
    });
  });

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
