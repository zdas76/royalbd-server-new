import { BankAccount } from "@prisma/client";
import prisma from "../../../shared/prisma";
import AppError from "../../errors/AppError";
import { StatusCodes } from "http-status-codes";
import { date } from "zod";

const getAllTransaction = async () => {
  const result = await prisma.bankTransaction.findMany({
    include: {
      bankAccount: true,
    },
  });

  return result;
};

const getTransactionById = async (id: number) => {
  const result = await prisma.bankTransaction.findFirst({
    where: { id },
    include: {
      bankAccount: true,
    },
  });

  return result;
};

const updateTransactionInfo = async (
  id: number,
  payload: Partial<BankAccount>
) => {
  //check account number isExisted
  const accountExisted = await prisma.bankTransaction.findFirst({
    where: { id },
  });

  if (!accountExisted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Account Found");
  }

  const result = await prisma.bankTransaction.update({
    where: { id },
    data: payload,
  });

  return result;
};

export const BankTransactionService = {
  getAllTransaction,
  getTransactionById,
  updateTransactionInfo,
};
