import {
  AccountsItem,
  BankTransaction,
  Inventory,
  ItemType,
  Journal,
  PartyType,
  PaymentType,
  Prisma,
  TransactionInfo,
  VoucherType,
} from "@prisma/client";
import prisma from "../../../shared/prisma";
import { tuple } from "zod";
import { Decimal } from "@prisma/client/runtime/library";

const getAllVucher = async () => {
  const result = await prisma.journal.findMany();

  return result;
};

const getVoucherById = async (id: number) => {
  const result = await prisma.journal.findFirst({
    where: { id },
    include: {
      transactionInfo: true,
      inventoryItem: true,
    },
  });

  return result;
};

const updateVoucherById = async () => {
  console.log("first");
};

//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = async (payload: any) => {
  const createPurchestVoucher = await prisma.$transaction(async (tx) => {
    const partyExists = await tx.party.findUnique({
      where: { id: payload.partyOrcustomerId, partyType: PartyType.SUPPLIER },
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
      partyType: PartyType.SUPPLIER,
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
    const BankTXData = payload?.creditItem?.map((item: any) => {
      if (item.bankId > 0 && item.bank_account !== null)
        ({
          bankAccountId: item?.bank_account,
          creditAmount: new Prisma.Decimal(item?.creditAmount || 0),
        });
    });
    console.log("first", BankTXData);

    if (!BankTXData == undefined && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData.map((bankTx: any) => ({
          ...bankTx,
          transectionId: createTransactionInfo.id, // Link to TransactionInfo
        })),
      });
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new Error("Invalid data: items must be a non-empty array");
    }

    //step 3: Prepare Inventory Data

    const inventoryData = payload.items.map((item: any) => {
      if (item.itemType === "RAW_MATERIAL") {
        return {
          itemType: item.itemType,
          rawId: item.rawOrProductId,
          unitePrice: new Prisma.Decimal(item.unitPrice || 0),
          quantityAdd: new Prisma.Decimal(item.quantityAdd || 0),
          discount: new Prisma.Decimal(item?.discount || 0),
          Journal: {
            create: {
              transectionId: createTransactionInfo.id,
              debitAmount: new Prisma.Decimal(item.debitAmount),
              narration: item.narration || "",
            },
          },
        };
      } else {
        return {
          itemType: item.itemType,
          productId: item.rawOrProductId,
          paymentType: payload.paymentType,
          unitePrice: new Prisma.Decimal(item.unitPrice || 0),
          quantityAdd: new Prisma.Decimal(item.quantityAdd || 0),
          discount: new Prisma.Decimal(item?.discount || 0),
          Journal: {
            create: {
              transectionId: createTransactionInfo.id,
              debitAmount: new Prisma.Decimal(item.debitAmount),
              narration: item.narration || "",
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
            Journal: true,
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
    }));

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: new Prisma.Decimal(item.amount || 0),
      narration: item?.narration || "",
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
      where: { contactNumber: payload?.customerId },
    });

    let transactionInfoData;

    if (customerExists) {
      transactionInfoData = {
        date: payload?.date,
        voucherNo: payload.voucherNo,
        partyType: PartyType.CUSTOMER,
        customerId: customerExists.id,
        paymentType: payload.paymentType,
        voucherType: VoucherType.SALES,
      };
    } else if (!customerExists && payload.partyType === PartyType.CUSTOMER) {
      transactionInfoData = {
        date: payload?.date,
        voucherNo: payload.voucherNo,
        partyType: PartyType.CUSTOMER,
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
        partyType: PartyType.VENDOR,
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

    // step 2: prepiar inventory data

    const inventoryData = payload.salseItem.map((item: any) => {
      if (item.itemType === "RAW_MATERIAL") {
        return {
          itemType: item.itemType,
          rawId: item.rawOrProductId,
          unitePrice: new Prisma.Decimal(item.unitPrice || 0),
          quantityLess: new Prisma.Decimal(item.quantity || 0),
          discount: new Prisma.Decimal(item?.discount || 0),
          Journal: {
            create: {
              transectionId: createTransactionInfo.id,
              creditAmount: new Prisma.Decimal(item.creditAmount),
              narration: item.narration || "",
            },
          },
        };
      } else {
        return {
          itemType: item.itemType,
          productId: item.rawOrProductId,
          unitePrice: new Prisma.Decimal(item.unitePrice || 0),
          quantityLess: new Prisma.Decimal(item.quantity || 0),
          discount: new Prisma.Decimal(item?.discount || 0),
          Journal: {
            create: {
              transectionId: createTransactionInfo.id,
              creditAmount: new Prisma.Decimal(item.creditAmount),
              narration: item.narration || "",
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
            Journal: true,
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
      debitAmount: new Prisma.Decimal(item.debitAmount || 0),
      narration: item?.narration || "",
    }));

    if (payload.discount && payload.discount > 0) {
      const discountItem: AccountsItem | any = await tx.accountsItem.findFirst({
        where: {
          accountsItemName: {
            contains: "discount",
          },
        },
      });

      if (payload.discount && discountItem) {
        journalDebitItems.push({
          transectionId: createTransactionInfo.id,
          accountsItemId: parseInt(discountItem.id!),
          debitAmount: new Prisma.Decimal(payload.discount),
          narration: "",
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
  console.log("first", payload);
  const createVoucher = await prisma.$transaction(async (tx) => {
    //check party
    const partyExists = await tx.party.findFirst({
      where: { id: payload.partyOrcustomerId },
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
    const BankTXData = payload?.creditItem?.map((item: any) => {
      if (item.bankId > 0 && item.bank_account !== null)
        ({
          bankAccountId: item?.bank_account,
          creditAmount: new Prisma.Decimal(item?.creditAmount || 0),
        });
    });
    console.log("first", BankTXData);

    if (!BankTXData === undefined && BankTXData.length > 0) {
      await tx.bankTransaction.createMany({
        data: BankTXData.map((bankTx: any) => ({
          ...bankTx,
          transectionId: createTransactionInfo.id, // Link to TransactionInfo
        })),
      });
    }
  });
  return createVoucher;
};

const createReceiptVoucher = async (payload: any) => {
  const createVoucher = await prisma.$transaction(async (tx) => {
    //check party
    const partyExists = await tx.party.findFirst({
      where: { id: payload.partyOrcustomerId },
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
      paymentType: PaymentType.PAID,
      voucherType: VoucherType.SALES,
    };

    // step 1. create transaction entries
    const createTransactionInfo: TransactionInfo =
      await tx.transactionInfo.create({
        data: transactionInfoData,
        include: {
          bankTransaction: true, // Fetch related bank transactions
        },
      });

    const journalDebitItems = payload.debitItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      debitAmount: new Prisma.Decimal(item.debitAmount || 0),
      narration: item?.narration || "",
    }));

    // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
    const journalCreditItems = payload.creditItem.map((item: any) => ({
      transectionId: createTransactionInfo.id,
      accountsItemId: item.accountsItemId,
      creditAmount: new Prisma.Decimal(item.creditAmount || 0),
      narration: item?.narration || "",
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
};
