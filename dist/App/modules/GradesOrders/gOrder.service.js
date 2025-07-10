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
exports.GradesOrderService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const getAllOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.logOrder.findMany();
    return result;
});
const createGradesOrder = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const creadtOrder = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const isSupplierExistd = yield tx.party.findFirst({
            where: {
                id: payLoad.supplierId,
                partyType: client_1.PartyType.SUPPLIER,
            },
        });
        if (!isSupplierExistd) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Supplier not found");
        }
        const isLogGradesExisted = yield Promise.all(payLoad.logOrderItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.logGradeId && item.quantity) {
                return yield tx.logGrades.findFirst({
                    where: { id: item.logGradeId },
                });
            }
            return null;
        })));
        if (isLogGradesExisted.some((item) => !item)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "One or more log grades not found");
        }
        const orderInfo = yield tx.logOrder.create({
            data: {
                supplierId: payLoad.supplierId,
                chalanNo: payLoad.chalanNo || null,
                date: payLoad.date,
                voucherNo: payLoad.voucherNo,
            },
        });
        const orderItem = payLoad.logOrderItem.map((item) => ({
            logOrderId: orderInfo.id,
            logGradeId: item.logGradeId,
            radis: item.radis,
            height: item.height,
            quantity: item.quantity,
            u_price: item.u_price,
            amount: item.amount,
        }));
        const logRes = yield tx.logOrderItem.createMany({
            data: orderItem,
        });
        const debitJournalItem = payLoad.debitItem
            .map((item) => {
            if (item.debitAmount && item.accountsItemId) {
                return {
                    logOrderId: orderInfo.id,
                    accountsItemId: item.accountsItemId,
                    debitAmount: item.debitAmount,
                    narration: item.narration || "",
                    date: payLoad.date,
                };
            }
            return null;
        })
            .filter(Boolean);
        console.log(debitJournalItem);
        if (debitJournalItem) {
            yield Promise.all(debitJournalItem.map((journal) => tx.journal.create({
                data: journal,
            })));
        }
        if (!Array.isArray(payLoad.creditItem) || payLoad.creditItem.length === 0) {
            throw new Error("Invalid data: Credit item must be a non-empty");
        }
        const creditJournalItem = payLoad.creditItem.map((item) => ({
            logOrderId: orderInfo.id,
            accountsItemId: item.accountsItemId,
            creditAmount: item.creditAmount,
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
            date: payLoad.date,
        }));
        yield tx.journal.createMany({
            data: creditJournalItem,
        });
        const logItemByCategoryData = payLoad.logItemsByCategory.map((item) => ({
            logOrderId: orderInfo.id,
            logCategoryId: item.logId,
            date: payLoad.date,
            quantityAdd: item.quantity,
            debitAmount: item.amount,
            unitPrice: item.unitPriceByCategory,
        }));
        yield tx.logOrdByCategory.createMany({
            data: logItemByCategoryData,
        });
        const result = yield tx.logOrder.findFirst({
            where: {
                id: orderInfo.id,
            },
            include: {
                logOrderItem: true,
                logOrdByCategory: true,
            },
        });
        return result;
    }));
    return creadtOrder;
});
//Get Log Total value
const getLogTotalByCagetoryId = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$queryRaw `
  
SELECT 
i.logCategoryId,

 SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
 SUM(IFNULL(i.debitAmount, 0)- IFNULL(i.creditAmount, 0)) AS netAmount
    
  FROM log_order_by_category i
  WHERE i.logCategoryId = ${payLoad.logCategoryId} AND i.date >= ${new Date(payLoad.date)}
  GROUP BY i.logCategoryId`;
    return result;
});
exports.GradesOrderService = {
    createGradesOrder,
    getAllOrder,
    getLogTotalByCagetoryId,
};
