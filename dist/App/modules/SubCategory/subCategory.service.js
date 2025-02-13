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
exports.SubCagetoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const createSubCategoryToDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payLoad);
    const subCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            subCategoryName: payLoad.subCategoryName,
        },
    });
    if (subCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = yield prisma_1.default.subCategory.create({
        data: {
            subCategoryName: payLoad.subCategoryName,
            categorryId: payLoad.categorryId,
        },
    });
    return result;
});
const getSubCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.subCategory.findMany();
    return result;
});
const subCategoryUpdate = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            subCategoryName: payLoad.subCategoryName,
        },
    });
    if (!subCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = yield prisma_1.default.subCategory.update({
        where: {
            id: subCategory.id,
        },
        data: {
            subCategoryName: payLoad.subCategoryName,
        },
    });
    return result;
});
const getCategorybyId = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const subCategory = yield prisma_1.default.subCategory.findFirst({
        where: {
            id: payLoad.id,
        },
    });
    if (!subCategory) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This Name already used");
    }
    const result = yield prisma_1.default.subCategory.findFirstOrThrow({
        where: {
            id: payLoad.id,
        },
    });
    return result;
});
exports.SubCagetoryService = {
    createSubCategoryToDB,
    getSubCategory,
    subCategoryUpdate,
    getCategorybyId,
};
