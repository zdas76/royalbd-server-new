"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JurnalService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getAllVucher = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.transactionInfo.findMany({});
    return result;
});
const getVoucherById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.transactionInfo.findFirst({
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
});
const updateVoucherById = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
});
//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("payload", payload);
    const createPurchestVoucher = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const partyExists = yield tx.party.findUnique({
            where: { id: payload.partyOrcustomerId },
        });
        if (!partyExists) {
            throw new Error(`Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`);
        }
        const transactionInfoData = {
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            invoiceNo: payload.invoiceNo || null,
            voucherNo: payload.voucherNo,
            partyId: partyExists.id,
            paymentType: payload.paymentType,
            voucherType: client_1.VoucherType.PURCHASE,
        };
        // step 1. create transaction entries
        const createTransactionInfo = yield tx.transactionInfo.create({
            data: transactionInfoData,
            include: {
                bankTransaction: true, // Fetch related bank transactions
            },
        });
        // 2. create bank transaction
        const BankTXData = [];
        payload.creditItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.bankId !== null) {
                BankTXData.push({
                    transectionId: createTransactionInfo.id,
                    bankAccountId: item.bankId,
                    date: payload.date,
                    creditAmount: new client_1.Prisma.Decimal(item === null || item === void 0 ? void 0 : item.amount).toNumber(),
                });
            }
        }));
        console.log(BankTXData);
        if (BankTXData.length > 0) {
            yield tx.bankTransaction.createMany({
                data: BankTXData,
            });
        }
        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            throw new Error("Invalid data: items must be a non-empty array");
        }
        //step 3: Prepare Inventory Data
        const inventoryData = payload.items.map((item) => {
            if (item.itemType === "RAW_MATERIAL") {
                return {
                    rawId: item.rawOrProductId,
                    unitPrice: item.unitPrice || 0,
                    quantityAdd: item.quantityAdd || 0,
                    discount: (item === null || item === void 0 ? void 0 : item.discount) || 0,
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
            }
            else {
                return {
                    productId: item.rawOrProductId,
                    unitPrice: item.unitPrice || 0,
                    quantityAdd: item.quantityAdd || 0,
                    discount: (item === null || item === void 0 ? void 0 : item.discount) || 0,
                    date: payload.date,
                    journal: {
                        create: {
                            transectionId: createTransactionInfo.id,
                            debitAmount: new client_1.Prisma.Decimal(item.debitAmount),
                            narration: item.narration || "",
                            date: payload.date,
                        },
                    },
                };
            }
        });
        //Step 3: Insert Inventory Records
        const createdItems = yield Promise.all(inventoryData.map((item) => tx.inventory.create({
            data: item,
            include: {
                journal: true,
            },
        })));
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalCostItems = payload.costItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item === null || item === void 0 ? void 0 : item.costItemId,
            debitAmount: new client_1.Prisma.Decimal(item.amount || 0),
            narration: item.narration || "",
            date: payload.date,
        }));
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalCreditItems = payload.creditItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            creditAmount: new client_1.Prisma.Decimal(item.amount || 0),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
            date: payload.date,
        }));
        const journalItems = [...journalCostItems, ...journalCreditItems];
        const createJournal = yield tx.journal.createMany({
            data: journalItems,
        });
        return createJournal;
    }));
    return createPurchestVoucher;
});
// create Salse Voucher
const createSalesVoucher = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createSalseVoucher = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //check party
        const partyExists = yield tx.party.findFirst({
            where: { id: payload.partyOrcustomerId },
        });
        if (!partyExists) {
            throw new Error(`Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`);
        }
        const customerExists = yield tx.customer.findFirst({
            where: { contactNumber: payload === null || payload === void 0 ? void 0 : payload.contactNumber },
        });
        let transactionInfoData;
        if (customerExists) {
            transactionInfoData = {
                date: payload === null || payload === void 0 ? void 0 : payload.date,
                voucherNo: payload.voucherNo,
                customerId: customerExists.id,
                paymentType: payload.paymentType,
                voucherType: client_1.VoucherType.SALES,
            };
        }
        else if (!customerExists && payload.partyType === client_1.PartyType.CUSTOMER) {
            transactionInfoData = {
                date: payload === null || payload === void 0 ? void 0 : payload.date,
                voucherNo: payload.voucherNo,
                customer: {
                    create: {
                        name: (payload === null || payload === void 0 ? void 0 : payload.name) || "",
                        contactNumber: payload.contactNumber,
                        address: payload.address || "",
                    },
                },
                paymentType: payload.paymentType,
                voucherType: client_1.VoucherType.SALES,
            };
        }
        else {
            transactionInfoData = {
                date: payload === null || payload === void 0 ? void 0 : payload.date,
                voucherNo: payload.voucherNo,
                partyId: partyExists.id,
                paymentType: payload.paymentType,
                voucherType: client_1.VoucherType.SALES,
            };
        }
        // step 1. create transaction entries
        const createTransactionInfo = yield tx.transactionInfo.create({
            data: transactionInfoData,
            include: {
                bankTransaction: true, // Fetch related bank transactions
                customer: true,
            },
        });
        // 2. create bank transaction
        const BankTXData = [];
        payload.debitItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.bankAccountId) {
                BankTXData.push({
                    transectionId: createTransactionInfo.id,
                    bankAccountId: item.bankAccountId,
                    date: payload.date,
                    debitAmount: new client_1.Prisma.Decimal(item === null || item === void 0 ? void 0 : item.debitAmount).toNumber(),
                });
            }
        }));
        if (BankTXData.length > 0) {
            yield tx.bankTransaction.createMany({
                data: BankTXData,
            });
        }
        if (!Array.isArray(payload.salseItem) || payload.salseItem.length === 0) {
            throw new Error("Invalid data: salseItem must be a non-empty array");
        }
        // step 2: prepiar inventory data
        const inventoryData = payload.salseItem.map((item) => ({
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
        const createdItems = yield Promise.all(inventoryData.map((item) => tx.inventory.create({
            data: item,
            include: {
                journal: true,
            },
        })));
        if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
            throw new Error("Invalid data: items must be a non-empty array");
        }
        const journalDebitItems = payload.debitItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            debitAmount: new client_1.Prisma.Decimal(item.debitAmount || 0).toNumber(),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
            date: payload.date,
        }));
        if (payload.totalDiscount && payload.totalDiscount > 0) {
            const discountItem = yield tx.accountsItem.findFirst({
                where: {
                    accountsItemName: {
                        contains: "discount",
                    },
                },
            });
            if (payload.totalDiscount && discountItem) {
                journalDebitItems.push({
                    transectionId: createTransactionInfo.id,
                    accountsItemId: parseInt(discountItem.id),
                    debitAmount: payload.totalDiscount,
                    narration: "",
                    date: payload.date,
                });
            }
        }
        const debitJournal = yield tx.journal.createMany({
            data: journalDebitItems,
        });
        return debitJournal;
    }));
    return createSalseVoucher;
});
// Create Payment Voucher
const createPaymentVoucher = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createVoucher = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //check party
        const partyExists = yield tx.party.findFirst({
            where: { id: payload.partyId },
        });
        if (!partyExists) {
            throw new Error(`Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`);
        }
        const transactionInfoData = {
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            voucherNo: payload.voucherNo,
            partyType: partyExists.partyType || null,
            partyId: partyExists.id || null,
            voucherType: client_1.VoucherType.PAYMENT,
        };
        // step 1. create transaction entries
        const createTransactionInfo = yield tx.transactionInfo.create({
            data: transactionInfoData,
        });
        // 2. create bank transaction
        const BankTXData = [];
        payload.debitItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.bankId) {
                BankTXData.push({
                    transectionId: createTransactionInfo.id,
                    bankAccountId: item.bankId,
                    date: payload.date,
                    debitAmount: new client_1.Prisma.Decimal(item === null || item === void 0 ? void 0 : item.amount).toNumber(),
                });
            }
        }));
        if (BankTXData) {
            yield tx.bankTransaction.createMany({
                data: BankTXData,
            });
        }
        if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
            throw new Error("Invalid data: salseItem must be a non-empty array");
        }
        const journalCreditItems = [];
        payload.creditItem.map((item) => {
            if (!item.bankId)
                journalCreditItems.push({
                    transectionId: createTransactionInfo.id,
                    accountsItemId: item.accountsItemId,
                    creditAmount: new client_1.Prisma.Decimal(item.amount || 0).toNumber(),
                    narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
                    date: payload.date,
                });
        });
        if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
            throw new Error("Invalid data: salseItem must be a non-empty array");
        }
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalDebitItems = payload.debitItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            debitAmount: new client_1.Prisma.Decimal(item.amount || 0).toNumber(),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
            date: payload.date,
        }));
        const journalItems = [...journalDebitItems, ...journalCreditItems];
        const createJournal = yield tx.journal.createMany({
            data: journalItems,
        });
        return createJournal;
    }));
    return createVoucher;
});
const createReceiptVoucher = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createVoucher = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //check party
        const partyExists = yield tx.party.findFirst({
            where: { id: payload.partyId },
        });
        if (!partyExists) {
            throw new Error(`Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party or Customer found.`);
        }
        const transactionInfoData = {
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            voucherNo: payload.voucherNo,
            partyType: partyExists.partyType,
            partyId: partyExists.id,
            voucherType: client_1.VoucherType.RECEIPT,
        };
        // step 1. create transaction entries
        const createTransactionInfo = yield tx.transactionInfo.create({
            data: transactionInfoData,
        });
        // 2. create bank transaction
        const BankTXData = [];
        payload.debitItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.bankId) {
                BankTXData.push({
                    transectionId: createTransactionInfo.id,
                    bankAccountId: item.bankId,
                    date: payload.date,
                    debitAmount: new client_1.Prisma.Decimal(item === null || item === void 0 ? void 0 : item.amount).toNumber(),
                });
            }
        }));
        console.log(BankTXData);
        if (BankTXData.length > 0) {
            yield tx.bankTransaction.createMany({
                data: BankTXData,
            });
        }
        if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
            throw new Error("Invalid data: salseItem must be a non-empty array");
        }
        const journalDebitItems = [];
        payload.debitItem.map((item) => {
            if (!item.bankId)
                journalDebitItems.push({
                    transectionId: createTransactionInfo.id,
                    accountsItemId: item.accountsItemId,
                    debitAmount: new client_1.Prisma.Decimal(item.amount || 0).toNumber(),
                    narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
                    date: payload.date,
                });
        });
        if (!Array.isArray(payload.creditItem) || payload.creditItem.length === 0) {
            throw new Error("Invalid data: salseItem must be a non-empty array");
        }
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalCreditItems = payload.creditItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            creditAmount: new client_1.Prisma.Decimal(item.amount || 0).toNumber(),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
            date: payload.date,
        }));
        const journalItems = [...journalDebitItems, ...journalCreditItems];
        const createJournal = yield tx.journal.createMany({
            data: journalItems,
        });
        return createJournal;
    }));
    return createVoucher;
});
const createJournalVoucher = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
});
const createQantaVoucher = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
});
const getItemTotalByAccountId = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const getDate = yield prisma_1.default.journal.findFirst({
        where: {
            accountsItemId: Number(payLoad.productId),
            isClosing: true,
        },
        orderBy: [{ id: "desc" }],
    });
    const result = yield prisma_1.default.$queryRaw `
  
SELECT 
j.accountsItemId,
 
 SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM journals j
  LEFT JOIN transaction_info t ON t.id = j.transectionId
  WHERE j.accountsItemId = ${payLoad.accountsItemId} AND  j.date >= ${(getDate === null || getDate === void 0 ? void 0 : getDate.date) || new Date(payLoad.date)} 
  GROUP BY j.accountsItemId`;
    return result[0];
});
exports.JurnalService = {
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
