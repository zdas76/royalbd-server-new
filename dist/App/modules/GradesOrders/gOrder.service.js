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
        const isLogGradesExisted = yield payLoad.logOrderItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            if (item.logGradesId && item.addQuantity) {
                return yield prisma_1.default.logGrades.findFirst({
                    where: { id: item.logGradesId },
                });
            }
        }));
        if (!isLogGradesExisted) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Log grades item not found");
        }
        const orderData = {
            supplierId: payLoad.supplierId,
            chalanNo: payLoad.chalanNo || null,
            date: payLoad.date,
            voucherNo: payLoad.voucherNo,
        };
        const orderInfo = yield tx.logOrder.create({
            data: orderData,
        });
        const orderItem = payLoad.logOrderItem.map((item) => ({
            logOrderId: orderInfo.id,
            logGradesId: item.logGradesId,
            radis: item.radis,
            height: item.height,
            addQuantity: item.addQuantity,
            u_price: item.u_price,
            debitAmount: item.debitAmount,
        }));
        const creadeOrderItem = yield tx.logOrderItem.createMany({
            data: orderItem,
        });
        const debitJournalItem = payLoad.debitItem.map((item) => ({
            logOrderId: orderInfo.id,
            accountsItemId: item.accountsItemId,
            debitAmount: item.debitAmount,
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
        }));
        if (!Array.isArray(payLoad.creditItem) || payLoad.creditItem.length === 0) {
            throw new Error("Invalid data: Credit item must be a non-empty");
        }
        const creditJournalItem = payLoad.creditItem.map((item) => ({
            logOrderId: orderInfo.id,
            accountsItemId: item.accountsItemId,
            creditAmount: item.creditAmount,
            narration: (item === null || item === void 0 ? void 0 : item.narration) || "",
        }));
        const journaData = [...debitJournalItem, ...creditJournalItem];
        const createJourna = yield tx.journal.createMany({
            data: journaData,
        });
        return orderInfo.id;
    }));
    const result = yield prisma_1.default.logOrder.findFirst({
        where: {
            id: creadtOrder,
        },
        include: {
            orderItem: true,
            Journal: true,
        },
    });
    return result;
});
exports.GradesOrderService = {
    createGradesOrder,
    getAllOrder,
};
