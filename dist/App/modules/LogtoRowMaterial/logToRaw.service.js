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
exports.LogToRawService = void 0;
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCategoryIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    //   const result = await prisma;
    const isExisted = yield prisma_1.default.logCategory.findUnique({
        where: {
            name: payLoad.name,
        },
    });
    if (isExisted) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This name already existed");
    }
    const result = yield prisma_1.default.logCategory.create({
        data: payLoad,
    });
    return result;
});
const getAllLogCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.logCategory.findMany();
    return result;
});
const getLogCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.logCategory.findMany({
        where: {
            id,
        },
    });
    return result;
});
const updateLogCategoryById = (id, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payLoad);
    const result = yield prisma_1.default.logCategory.update({
        where: {
            id,
        },
        data: payLoad,
    });
    return result;
});
exports.LogToRawService = {
    createCategoryIntoDB,
    getAllLogCategory,
    getLogCategoryById,
    updateLogCategoryById,
};
