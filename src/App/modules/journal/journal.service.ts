import { date } from "zod";
import {
  AccountsItem,
  ItemType,
  PartyType,
  Prisma,
  TransactionInfo,
  VoucherType,
} from "@prisma/client";
import prisma from "../../../shared/prisma";

const getAllVucher = async () => {
  const result = await prisma.transactionInfo.findMany({});

  return result;
};

const getVoucherById = async (id: number) => {
  const result = await prisma.transactionInfo.findFirst({
    where: { id },
    include: {
      journal: {
        include: {
          inventoryItem: true,
          accountsItem: true,
        },
      },
      party: true,
      customer: true,
      bankTransaction: true,
    },
  });

  return result;
};

const updateVoucherById = async () => {
  console.log("first");
};

//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = async (payload: any) => {
  console.log("payload", payload);

  const createPurchestVoucher = await prisma.$transaction(async (tx) => {
    const partyExists = await tx.party.findUnique({
      where: { id: payload.partyOrcustomerId },
    });

    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`
      );
    }
    const transactionInfoData: any = {
      date: payload?.date,
      invoiceNo: payload.invoiceNo || null,
      voucherNo: payload.voucherNo,
      partyId: partyExists.id,
      paymentType: payload.paymentType,
      voucherType: VoucherType.PURCHASE,
    };

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: transactionInfoData,
        include: {
          bankTransaction: true, // Fetch related bank transactions
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      creditAmount: number;
      date: Date;
    }[] = [];

    payload.creditItem.map(async (item: any) => {
      if (item.bankId !== null) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankId,
          date: payload.date,
          creditAmount: new Prisma.Decimal(item?.amount).toNumber(),
        });
      }
    });

    console.log(BankTXData);

    if (BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    //step 3: Prepare Inventory Data
    const inventoryData = payload.items.map((item: any) => {
      if (item.itemType === "RAW_MATERIAL") {
        return {
          rawId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          quantityAdd: item.quantityAdd || 0,
          discount: item?.discount || 0,
          date: payload.date,
          journal: {
            create: {
              transectionId: createTransactionInfo.id,
              debitAmount: item.debitAmount,
              narration: item.narration || "",
              date: payload.date,
            },
          },
        };
      } else {
        return {
          productId: item.rawOrProductId,
          unitPrice: item.unitPrice || 0,
          quantityAdd: item.quantityAdd || 0,
          discount: item?.discount || 0,
          date: payload.date,
          journal: {
            create: {
              transectionId: createTransactionInfo.id,
              debitAmount: new Prisma.Decimal(item.debitAmount),
              narration: item.narration || "",
              date: payload.date,
            },
          },
        };
      }
    });

    //Step 3: Insert Inventory Records

    const createdItems = await Promise.all(
      inventoryData.map((item: any) =>
        tx.inventory.create({
          data: item,
          include: {
            journal: true,
          },
        })
      )
    );

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCostItems = payload.costItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item?.costItemId,
      debitAmount: new Prisma.Decimal(item.amount || 0),
      narration: item.narration || "",
      date: payload.date,
    }));

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: new Prisma.Decimal(item.amount || 0),
      narration: item?.narration || "",
      date: payload.date,
    }));

    const journalItems = [...journalCostItems, ...journalCreditItems];

    const createJournal = await tx.journal.createMany({
      data: journalItems,
    });
    return createJournal;
  });
  return createPurchestVoucher;
};

// create Salse Voucher
const createSalesVoucher = async (payload: any) => {
  const createSalseVoucher = await prisma.$transaction(async (tx) => {
    //check party
    const partyExists = await tx.party.findFirst({
      where: { id: payload.partyOrcustomerId },
    });

    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`
      );
    }

    const customerExists = await tx.customer.findFirst({
      where: { contactNumber: payload?.contactNumber },
    });

    let transactionInfoData;

    if (customerExists) {
      transactionInfoData = {
        date: payload?.date,
        voucherNo: payload.voucherNo,
        customerId: customerExists.id,
        paymentType: payload.paymentType,
        voucherType: VoucherType.SALES,
      };
    } else if (!customerExists && payload.partyType === PartyType.CUSTOMER) {
      transactionInfoData = {
        date: payload?.date,
        voucherNo: payload.voucherNo,
        customer: {
          create: {
            name: payload?.name || "",
            contactNumber: payload.contactNumber,
            address: payload.address || "",
          },
        },
        paymentType: payload.paymentType,
        voucherType: VoucherType.SALES,
      };
    } else {
      transactionInfoData = {
        date: payload?.date,
        voucherNo: payload.voucherNo,
        partyId: partyExists.id,
        paymentType: payload.paymentType,
        voucherType: VoucherType.SALES,
      };
    }

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: transactionInfoData,
        include: {
          bankTransaction: true, // Fetch related bank transactions
          customer: true,
        },
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    payload.debitItem.map(async (item: any) => {
      if (item.bankAccountId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankAccountId,
          date: payload.date,
          debitAmount: new Prisma.Decimal(item?.debitAmount).toNumber(),
        });
      }
    });

    if (BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.salseItem) || payload.salseItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // step 2: prepiar inventory data

    const inventoryData = payload.salseItem.map((item: any) => ({
      productId: item.rawOrProductId,
      unitPrice: item.unitPrice || 0,
      quantityLess: item.quantity || 0,
      discount: item.discount || 0,
      date: payload.date,
      journal: {
        create: {
          transectionId: createTransactionInfo.id,
          creditAmount: item.creditAmount,
          narration: item.narration || "",
          date: payload.date,
        },
      },
    }));

    //Step 3: Insert Inventory Records

    const createdItems = await Promise.all(
      inventoryData.map((item: any) =>
        tx.inventory.create({
          data: item,
          include: {
            journal: true,
          },
        })
      )
    );

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    const journalDebitItems = payload.debitItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      debitAmount: new Prisma.Decimal(item.debitAmount || 0).toNumber(),
      narration: item?.narration || "",
      date: payload.date,
    }));

    if (payload.totalDiscount && payload.totalDiscount > 0) {
      const discountItem: AccountsItem | any = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.totalDiscount && discountItem) {
        journalDebitItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id!),
          debitAmount: payload.totalDiscount,
          narration: "",
          date: payload.date,
        });
      }
    }

    const debitJournal = await tx.journal.createMany({
      data: journalDebitItems,
    });
    return debitJournal;
  });

  return createSalseVoucher;
};

// Create Payment Voucher
const createPaymentVoucher = async (payload: any) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    //check party
    const partyExists = await tx.party.findFirst({
      where: { id: payload.partyId },
    });

    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`
      );
    }
    const transactionInfoData = {
      date: payload?.date,
      voucherNo: payload.voucherNo,
      partyType: partyExists.partyType || null,
      partyId: partyExists.id || null,
      voucherType: VoucherType.PAYMENT,
    };

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: transactionInfoData,
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    payload.debitItem.map(async (item: any) => {
      if (item.bankId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankId,
          date: payload.date,
          debitAmount: new Prisma.Decimal(item?.amount).toNumber(),
        });
      }
    });

    if (BankTXData) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    const journalCreditItems: {
      transectionId: number;
      accountsItemId: number;
      creditAmount: number;
      narration: string;
      date: string;
    }[] = [];

    payload.creditItem.map((item: any) => {
      if (!item.bankId)
        journalCreditItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: item.accountsItemId,
          creditAmount: new Prisma.Decimal(item.amount || 0).toNumber(),
          narration: item?.narration || "",
          date: payload.date,
        });
    });

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalDebitItems = payload.debitItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      debitAmount: new Prisma.Decimal(item.amount || 0).toNumber(),
      narration: item?.narration || "",
      date: payload.date,
    }));

    const journalItems = [...journalDebitItems, ...journalCreditItems];

    const createJournal = await tx.journal.createMany({
      data: journalItems,
    });
    return createJournal;
  });
  return createVoucher;
};

const createReceiptVoucher = async (payload: any) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    //check party
    const partyExists = await tx.party.findFirst({
      where: { id: payload.partyId },
    });

    if (!partyExists) {
      throw new Error(
        `Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`
      );
    }
    const transactionInfoData = {
      date: payload?.date,
      voucherNo: payload.voucherNo,
      partyType: partyExists.partyType,
      partyId: partyExists.id,
      voucherType: VoucherType.RECEIPT,
    };

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: transactionInfoData,
      });

    // 2. create bank transaction
    const BankTXData: {
      transectionId: number;
      bankAccountId: number;
      debitAmount: number;
      date: Date;
    }[] = [];

    payload.debitItem.map(async (item: any) => {
      if (item.bankId) {
        BankTXData.push({
          transectionId: createTransactionInfo.id,
          bankAccountId: item.bankId,
          date: payload.date,
          debitAmount: new Prisma.Decimal(item?.amount).toNumber(),
        });
      }
    });
    console.log(BankTXData);

    if (BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData,
      });
    }

    if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    const journalDebitItems: {
      transectionId: number;
      accountsItemId: number;
      debitAmount: number;
      narration: string;
      date: string;
    }[] = [];

    payload.debitItem.map((item: any) => {
      if (!item.bankId)
        journalDebitItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: item.accountsItemId,
          debitAmount: new Prisma.Decimal(item.amount || 0).toNumber(),
          narration: item?.narration || "",
          date: payload.date,
        });
    });

    if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
      throw new Error("Invalid data: salseItem must be a non-empty array");
    }

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: new Prisma.Decimal(item.amount || 0).toNumber(),
      narration: item?.narration || "",
      date: payload.date,
    }));

    const journalItems = [...journalDebitItems, ...journalCreditItems];

    const createJournal = await tx.journal.createMany({
      data: journalItems,
    });
    return createJournal;
  });
  return createVoucher;
};

const createJournalVoucher = async () => {
  console.log("first");
};

const createQantaVoucher = async () => {
  console.log("first");
};

const getItemTotalByAccountId = async (payLoad: any) => {
  const getDate = await prisma.journal.findFirst({
    where: {
      accountsItemId: Number(payLoad.productId),
      isClosing: true,
    },

    orderBy: [{ id: "desc" }],
  });

  const result = await prisma.$queryRaw`
  
SELECT 
j.accountsItemId,
 
 SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM journals j
  LEFT JOIN transaction_info t ON t.id = j.transectionId
  WHERE j.accountsItemId = ${payLoad.accountsItemId} AND  j.date >= ${
    getDate?.date || new Date(payLoad.date)
  } 
  GROUP BY j.accountsItemId`;

  return (result as any[])[0];
};

export const JurnalService = {
  createPurchestReceivedIntoDB,
  createSalesVoucher,
  getAllVucher,
  getVoucherById,
  updateVoucherById,
  createPaymentVoucher,
  createReceiptVoucher,
  createJournalVoucher,
  createQantaVoucher,
  getItemTotalByAccountId,
};
