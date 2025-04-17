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
exports.BankTransactionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bankTransaction.findMany({
        include: {
            bankAccount: true,
        },
    });
    return result;
});
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bankTransaction.findFirst({
        where: { id },
        include: {
            bankAccount: true,
        },
    });
    return result;
});
const updateTransactionInfo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check account number isExisted
    const accountExisted = yield prisma_1.default.bankTransaction.findFirst({
        where: { id },
    });
    if (!accountExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Account Found");
    }
    const result = yield prisma_1.default.bankTransaction.update({
        where: { id },
        data: payload,
    });
    return result;
});
exports.BankTransactionService = {
    getAllTransaction,
    getTransactionById,
    updateTransactionInfo,
};
