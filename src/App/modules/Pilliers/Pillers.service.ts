import { AccountMainPiller } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createPliersItemIntoDB = async (
  payLoad: AccountMainPiller
): Promise<AccountMainPiller> => {
  const result = await prisma.accountMainPiller.create({
    data: payLoad,
  });

  return result;
};

const getAllPillerItem = async () => {
  const result = await prisma.accountMainPiller.findMany();

  return result;
};

export const PillersService = {
  createPliersItemIntoDB,
  getAllPillerItem,
};
