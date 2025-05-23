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
exports.AccountItemService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createAccountsItemtoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.accountsItem.findFirst({
        where: {
            accountMainPillerId: payLoad.accountMainPillerId,
            accountsItemId: payLoad.accountsItemId,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This item already exist");
    }
    const checkPiller = yield prisma_1.default.accountMainPiller.findUnique({
        where: {
            pillerId: payLoad.accountMainPillerId,
        },
    });
    if (!checkPiller) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Accounts head not found");
    }
    const result = yield prisma_1.default.accountsItem.create({
        data: payLoad,
    });
    return result;
});
const getAccountsItemFromDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    let filerValue = {};
    if (payLoad) {
        const filer = JSON.parse(payLoad).map((id) => {
            return { accountMainPillerId: id };
        });
        console.log(filer);
        filerValue = {
            OR: filer,
        };
    }
    const result = yield prisma_1.default.accountsItem.findMany({
        where: filerValue,
        orderBy: {
            accountMainPillerId: "asc",
        },
        include: {
            accountsPiler: true,
        },
    });
    return result;
});
const getAccountsItemByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.accountsItem.findFirst({
        where: { id },
        include: {
            accountsPiler: true,
        },
    });
    return result;
});
const updateAccountsItemFromDBbyId = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.accountsItem.update({
        where: { id },
        data: payLoad,
    });
    return result;
});
exports.AccountItemService = {
    createAccountsItemtoDB,
    getAccountsItemFromDB,
    getAccountsItemByIdFromDB,
    updateAccountsItemFromDBbyId,
};
