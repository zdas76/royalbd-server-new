import { AccountMainPiller } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createPliersItemIntoDB = async (
  payLoad: AccountMainPiller
): Promise<AccountMainPiller[] | AccountMainPiller> => {
  const result = await prisma.accountMainPiller.create({
    data: payLoad,
  });

  return result;
};

export const PillersService = {
  createPliersItemIntoDB,
};
