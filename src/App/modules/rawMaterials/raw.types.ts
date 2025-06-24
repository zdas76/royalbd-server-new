import { ItemType, Status } from "@prisma/client";

export type TrawMaterial = {
  unitId: any;
  name: string;
  id: number;
  itemType: ItemType;
  createdAt: Date;
  description: string | null;
  isDeleted: boolean;
  initialStock: {
    quantity: number;
    unitPrice: number;
    amount: number;
    date: Date;
  };
  status: Status;
  updateAt: Date;
};
