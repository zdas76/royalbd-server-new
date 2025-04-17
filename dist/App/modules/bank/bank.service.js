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
exports.BankAccountService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createBankAccount = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check account number isExisted
    const accountExisted = yield prisma_1.default.bankAccount.findFirst({
        where: {
            bankName: payload.bankName,
            accountNumber: payload.accountNumber,
        },
    });
    if (accountExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This account already existed");
    }
    const accountData = {
        bankName: payload.bankName,
        branceName: payload.branceName,
        accountNumber: payload.accountNumber,
        bankClosing: {
            create: {
                date: (payload === null || payload === void 0 ? void 0 : payload.date) || new Date(),
                closingAmount: new client_1.Prisma.Decimal((payload === null || payload === void 0 ? void 0 : payload.amount) || 0),
            },
        },
    };
    const result = yield prisma_1.default.bankAccount.create({
        data: accountData,
        include: {
            bankClosing: true,
        },
    });
    return result;
});
const getAllBankAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bankAccount.findMany({
        include: {
            bankClosing: true,
        },
    });
    return result;
});
const getBankAccountById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.bankAccount.findFirst({
        where: { id },
        include: {
            bankClosing: true,
        },
    });
    return result;
});
const updateAccountInfo = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check account number isExisted
    const accountExisted = yield prisma_1.default.bankAccount.findFirst({
        where: { id },
    });
    if (!accountExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No Account Found");
    }
    const result = yield prisma_1.default.bankAccount.update({
        where: { id },
        data: payload,
    });
    return result;
});
exports.BankAccountService = {
    createBankAccount,
    getAllBankAccount,
    getBankAccountById,
    updateAccountInfo,
};
