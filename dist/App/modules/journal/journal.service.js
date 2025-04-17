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
    const result = yield prisma_1.default.journal.findMany();
    return result;
});
const getVoucherById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.journal.findFirst({
        where: { id },
        include: {
            transactionInfo: true,
            inventoryItem: true,
        },
    });
    return result;
});
const updateVoucherById = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first");
});
//Create Purchase Received Voucher
const createPurchestReceivedIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createPurchestVoucher = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const partyExists = yield tx.party.findUnique({
            where: { id: payload.partyOrcustomerId, partyType: client_1.PartyType.SUPPLIER },
        });
        if (!partyExists) {
            throw new Error(`Invalid partyOrcustomerId: ${payload.partyOrcustomerId}. No matching Party found.`);
        }
        const transactionInfoData = {
            date: payload === null || payload === void 0 ? void 0 : payload.date,
            invoiceNo: payload.invoiceNo || null,
            voucherNo: payload.voucherNo,
            partyType: client_1.PartyType.SUPPLIER,
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
        const BankTXData = (_a = payload === null || payload === void 0 ? void 0 : payload.creditItem) === null || _a === void 0 ? void 0 : _a.map((item) => {
            if (item.bankId > 0 && item.bank_account !== null)
                ({
                    bankAccountId: item === null || item === void 0 ? void 0 : item.bank_account,
                    creditAmount: new client_1.Prisma.Decimal((item === null || item === void 0 ? void 0 : item.creditAmount) || 0),
                });
        });
        console.log("first", BankTXData);
        if (!BankTXData == undefined && BankTXData.length > 0) {
            yield tx.bankTransaction.createMany({
                data: BankTXData.map((bankTx) => (Object.assign(Object.assign({}, bankTx), { transectionId: createTransactionInfo.id }))),
            });
        }
        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            throw new Error("Invalid data: items must be a non-empty array");
        }
        //step 3: Prepare Inventory Data
        const inventoryData = payload.items.map((item) => {
            if (item.itemType === "RAW_MATERIAL") {
                return {
                    itemType: item.itemType,
                    rawId: item.rawOrProductId,
                    unitePrice: new client_1.Prisma.Decimal(item.unitPrice || 0),
                    quantityAdd: new client_1.Prisma.Decimal(item.quantityAdd || 0),
                    discount: new client_1.Prisma.Decimal((item === null || item === void 0 ? void 0 : item.discount) || 0),
                    Journal: {
                        create: {
                            transectionId: createTransactionInfo.id,
                            debitAmount: new client_1.Prisma.Decimal(item.debitAmount),
                            narration: item.narration || "",
                        },
                    },
                };
            }
            else {
                return {
                    itemType: item.itemType,
                    productId: item.rawOrProductId,
                    paymentType: payload.paymentType,
                    unitePrice: new client_1.Prisma.Decimal(item.unitPrice || 0),
                    quantityAdd: new client_1.Prisma.Decimal(item.quantityAdd || 0),
                    discount: new client_1.Prisma.Decimal((item === null || item === void 0 ? void 0 : item.discount) || 0),
                    Journal: {
                        create: {
                            transectionId: createTransactionInfo.id,
                            debitAmount: new client_1.Prisma.Decimal(item.debitAmount),
                            narration: item.narration || "",
                        },
                    },
                };
            }
        });
        //Step 3: Insert Inventory Records
        const createdItems = yield Promise.all(inventoryData.map((item) => tx.inventory.create({
            data: item,
            include: {
                Journal: true,
            },
        })));
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalCostItems = payload.costItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item === null || item === void 0 ? void 0 : item.costItemId,
            debitAmount: new client_1.Prisma.Decimal(item.amount || 0),
            narration: item.narration || "",
        }));
        // Step 7: Prepare Journal Credit Entries (For Payment Accounts)
        const journalCreditItems = payload.creditItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            creditAmount: new client_1.Prisma.Decimal(item.amount || 0),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
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
            where: { contactNumber: payload === null || payload === void 0 ? void 0 : payload.customerId },
        });
        let transactionInfoData;
        if (customerExists) {
            transactionInfoData = {
                date: payload === null || payload === void 0 ? void 0 : payload.date,
                voucherNo: payload.voucherNo,
                partyType: client_1.PartyType.CUSTOMER,
                customerId: customerExists.id,
                paymentType: payload.paymentType,
                voucherType: client_1.VoucherType.SALES,
            };
        }
        else if (!customerExists && payload.partyType === client_1.PartyType.CUSTOMER) {
            transactionInfoData = {
                date: payload === null || payload === void 0 ? void 0 : payload.date,
                voucherNo: payload.voucherNo,
                partyType: client_1.PartyType.CUSTOMER,
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
                partyType: client_1.PartyType.VENDOR,
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
        // step 2: prepiar inventory data
        const inventoryData = payload.salseItem.map((item) => {
            if (item.itemType === "RAW_MATERIAL") {
                return {
                    itemType: item.itemType,
                    rawId: item.rawOrProductId,
                    unitePrice: new client_1.Prisma.Decimal(item.unitPrice || 0),
                    quantityLess: new client_1.Prisma.Decimal(item.quantity || 0),
                    discount: new client_1.Prisma.Decimal((item === null || item === void 0 ? void 0 : item.discount) || 0),
                    Journal: {
                        create: {
                            transectionId: createTransactionInfo.id,
                            creditAmount: new client_1.Prisma.Decimal(item.creditAmount),
                            narration: item.narration || "",
                        },
                    },
                };
            }
            else {
                return {
                    itemType: item.itemType,
                    productId: item.rawOrProductId,
                    unitePrice: new client_1.Prisma.Decimal(item.unitePrice || 0),
                    quantityLess: new client_1.Prisma.Decimal(item.quantity || 0),
                    discount: new client_1.Prisma.Decimal((item === null || item === void 0 ? void 0 : item.discount) || 0),
                    Journal: {
                        create: {
                            transectionId: createTransactionInfo.id,
                            creditAmount: new client_1.Prisma.Decimal(item.creditAmount),
                            narration: item.narration || "",
                        },
                    },
                };
            }
        });
        //Step 3: Insert Inventory Records
        const createdItems = yield Promise.all(inventoryData.map((item) => tx.inventory.create({
            data: item,
            include: {
                Journal: true,
            },
        })));
        if (!Array.isArray(payload.debitItem) || payload.debitItem.length === 0) {
            throw new Error("Invalid data: items must be a non-empty array");
        }
        const journalDebitItems = payload.debitItem.map((item) => ({
            transectionId: createTransactionInfo.id,
            accountsItemId: item.accountsItemId,
            debitAmount: new client_1.Prisma.Decimal(item.debitAmount || 0),
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
        }));
        if (payload.discount && payload.discount > 0) {
            const discountItem = yield tx.accountsItem.findFirst({
                where: {
                    accountsItemName: {
                        contains: "discount",
                    },
                },
            });
            if (payload.discount && discountItem) {
                journalDebitItems.push({
                    transectionId: createTransactionInfo.id,
                    accountsItemId: parseInt(discountItem.id),
                    debitAmount: new client_1.Prisma.Decimal(payload.discount),
                    narration: "",
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
exports.JurnalService = {
    createPurchestReceivedIntoDB,
    createSalesVoucher,
    getAllVucher,
    getVoucherById,
    updateVoucherById,
};
