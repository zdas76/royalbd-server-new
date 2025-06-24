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
exports.GradesService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const crateGradeIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payLoad);
    const isExistCategory = yield prisma_1.default.logCategory.findUnique({
        where: {
            id: payLoad.categoryId,
        },
    });
    if (!isExistCategory) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No category name exist");
    }
    const isExistName = yield prisma_1.default.logGrades.findFirst({
        where: {
            categoryId: payLoad.categoryId,
            gradeName: payLoad.gradeName,
        },
    });
    if (isExistName) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This grade name already exist");
    }
    const result = yield prisma_1.default.logGrades.create({
        data: payLoad,
    });
    if (payLoad.initialStock) {
        yield prisma_1.default.logOrdByCategory.create({
            data: {
                logCategoryId: payLoad.categoryId,
                quantityAdd: payLoad.initialStock.quantity,
                debitAmount: payLoad.initialStock.amount,
                unitPrice: payLoad.initialStock.amount / payLoad.initialStock.quantity,
                date: payLoad.initialStock.date,
            },
        });
    }
    return result;
});
const getGradeFromToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.logGrades.findMany({
        include: {
            logCategory: true,
        },
    });
    return result;
});
const getGradeFromToDBById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.logGrades.findFirst({
        where: { id },
    });
    return result;
});
const updateGradeFromToDBById = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistName = yield prisma_1.default.logGrades.findFirst({
        where: {
            gradeName: payLoad.gradeName,
        },
    });
    if (!isExistName) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No grade name found");
    }
    const result = yield prisma_1.default.logGrades.update({
        where: { id },
        data: payLoad,
    });
    return result;
});
exports.GradesService = {
    crateGradeIntoDB,
    getGradeFromToDB,
    getGradeFromToDBById,
    updateGradeFromToDBById,
};
