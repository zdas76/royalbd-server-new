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
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const createAccountsItemtoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.accountsItem.findFirst({
        where: {
            accountMainPillerId: payLoad.accountMainPillerId,
            accountsItemName: payLoad.accountsItemId,
        },
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This item already exist");
    }
    const result = yield prisma_1.default.accountsItem.create({
        data: payLoad,
    });
    return result;
});
const getAccountsItemFromDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first", payLoad);
});
const getAccountsItemByIdFromDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first", payLoad);
});
const updateAccountsItemFromDBbyId = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("first", payLoad);
});
exports.AccountItemService = {
    createAccountsItemtoDB,
    getAccountsItemFromDB,
    getAccountsItemByIdFromDB,
    updateAccountsItemFromDBbyId,
};
