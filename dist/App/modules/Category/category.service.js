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
exports.CagetoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCategoryToDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: payLoad.categoryName,
        },
    });
    if (category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = yield prisma_1.default.category.create({
        data: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
});
const getCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findMany({});
    return result;
});
const categoryUpdate = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.category.findFirst({
        where: {
            categoryName: payLoad.categoryName,
        },
    });
    if (!category) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = yield prisma_1.default.category.update({
        where: {
            id: category.id,
        },
        data: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
});
const getCategorybyId = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.category.findFirstOrThrow({
        where: {
            categoryName: payLoad.categoryName,
        },
    });
    return result;
});
exports.CagetoryService = {
    createCategoryToDB,
    getCategory,
    categoryUpdate,
    getCategorybyId,
};
