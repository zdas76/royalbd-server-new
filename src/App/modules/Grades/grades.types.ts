import { Status } from "@prisma/client";

export type TLogGradesTypes = {
  id: number;
  categoryId: number;
  gradeName: string;
  minRadius: number;
  maxRadius: number;
  unitePrice: number;
  status: Status;
  initialStock: {
    quantity: number;
    uniterPrice: number;
    amount: number;
    date: Date;
  };
  islogGradeClosing: boolean;
  createdAt: Date;
  updatedAt: Date;
};
