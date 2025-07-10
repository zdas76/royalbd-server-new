import { Status } from "@prisma/client";

export type TBankAccount = {
  id: number;
  bankName: string;
  branceName?: string;
  accountNumber: string;
  initalAmount: 50000;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};
