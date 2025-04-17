import { BankAccount, BankClosing, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { date } from "zod";

const createBankAccount = async (payload: BankAccount | any) => {
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
    bankClosing: {
      create: {
        date: payload?.date || new Date(),
        closingAmount: new Prisma.Decimal(payload?.amount || 0),
      },
    },
  };
  const result = await prisma.bankAccount.create({
    data: accountData,
    include: {
      bankClosing: true,
    },
  });

  return result;
};

const getAllBankAccount = async () => {
  const result = await prisma.bankAccount.findMany({
    include: {
      bankClosing: true,
    },
  });

  return result;
};

const getBankAccountById = async (id: number) => {
  const result = await prisma.bankAccount.findFirst({
    where: { id },
    include: {
      bankClosing: true,
    },
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
