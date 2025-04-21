import prisma from "../../../shared/prisma";

const getCustomerById = async (contactNumber: string) => {
  const result = await prisma.customer.findFirst({
    where: {
      contactNumber: {
        search: contactNumber,
      },
    },
  });
};

export const CustomerService = {
  getCustomerById,
};
