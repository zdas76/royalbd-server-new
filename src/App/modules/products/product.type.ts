import { ItemType, Status } from "@prisma/client";

export type TcreateProduct = {
  id: number;
  name: string;
  description: string;
  subCategoryId: number;
  minPrice: number | null;
  color: string | null;
  size: string | null;
  itemType: ItemType;
  isDeleted: boolean;
  status: Status;
  initialStock: {
    quantity: number;
    uniterPrice: number;
    amount: number;
    date: Date;
  };
  createdAt: Date;
  updateAt: Date;
};
