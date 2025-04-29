import prisma from "../../../shared/prisma";

const getCustomerById = async (contact: string) => {
  const result = await prisma.customer.findMany({
    where: {
      contactNumber: {
        contains: contact,
      },
    },
  });
  return result;
};

export const CustomerService = {
  getCustomerById,
};
