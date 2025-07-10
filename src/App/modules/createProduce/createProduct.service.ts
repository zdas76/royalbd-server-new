import { Inventory, ItemType } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createProductInfo = async (payLoad: any) => {
  const addProduct = await prisma.$transaction(async (tx) => {
    // 1. check product item
    const isProductExisted = await prisma.product.findFirst({
      where: {
        id: payLoad.product.id,
        itemType: ItemType.PRODUCT,
        isDeleted: false,
      },
    });

    if (!isProductExisted) {
      throw new Error(`Invalid Product name.`);
    }

    const productInventory = {
      productId: isProductExisted.id,
      itemType: ItemType.PRODUCT,
      quantityAdd: payLoad?.product?.quantity,
      unitPrice: payLoad?.product?.unitcost,
    };

    // 2. add Raw Materials
    const isRawMaterialExisted = payLoad.rowMaterials.map(
      async (item: {
        rowMaterialsId: number;
        rowUnitprice: number;
        totalAmount: number;
        quantity: number;
      }) =>
        await prisma.product.findFirst({
          where: {
            id: item.rowMaterialsId,
            itemType: ItemType.RAW_MATERIAL,
            isDeleted: false,
          },
        })
    );

    if (!isRawMaterialExisted) {
      throw new Error(`Invalid raw material.`);
    }
    const rowMaterialInventory = payLoad.rowMaterials.map(
      (item: {
        rowMaterialsId: number;
        rowUnitprice: number;
        totalAmount: number;
        quantity: number;
      }) => ({
        rawId: item.rowMaterialsId,
        itemType: ItemType.RAW_MATERIAL,
        quantityLess: item.quantity,
        unitPrice: item.rowUnitprice,
      })
    );
    const InventoryItem = [...rowMaterialInventory, productInventory];

    // Step 3: Prepare Journal Credit Entries (For Payment Accounts)
    const costItemsJournal = payLoad.expenses.map((item: any) => ({
      accountsItem: {
        connect: { id: item.accountsItemId },
      },
      debitAmount: item.amount,
      narration: item.narration || "",
      date: payLoad.date,
    }));

    // step 4: Prepare product Journal
    const productJournal = {
      inventoryItem: {
        connect: { id: payLoad?.product?.productId },
      },
      debitAmount: payLoad?.product?.amount,
      narration: payLoad?.product?.narration || "",
      date: payLoad.date,
    };

    //Step: 5: create Raw Material Journal
    const rowMaterialJournal = payLoad.rowMaterials.map(
      (item: {
        rowMaterialsId: number;
        rowUnitprice: number;
        totalAmount: number;
        quantity: number;
      }) => ({
        inventoryItem: {
          connect: { id: item.rowMaterialsId },
        },
        creditAmount: payLoad?.product?.amount,
        narration: payLoad?.product?.narration || "",
        date: payLoad.date,
      })
    );
    const journalItem = [
      ...costItemsJournal,
      productJournal,
      ...rowMaterialJournal,
    ];

    const createProduct = tx.createProduct.create({
      data: {
        voucherNo: payLoad.voucherNo,
        date: payLoad.date,
        inventory: {
          create: InventoryItem,
        },
        journal: {
          create: journalItem,
        },
      },
      include: {
        inventory: true,
        journal: {
          include: {
            accountsItem: true,
            inventoryItem: true,
          },
        },
      },
    });

    return createProduct;
  });
  const getCreatedProduct = await prisma.createProduct.findFirst({
    where: {
      id: addProduct?.id,
    },
    include: {
      journal: true,
      inventory: true,
    },
  });
  return getCreatedProduct;
};

export const CreateProductServices = {
  createProductInfo,
};
