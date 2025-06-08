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
exports.RowMaterialsService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createRawMaterial = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.rawMaterial.findFirst({
        where: {
            name: payload.name,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This name is already used");
    }
    const result = yield prisma_1.default.rawMaterial.create({
        data: payload,
    });
    if (payload.initialStock) {
        yield prisma_1.default.inventory.create({
            data: {
                rawId: result.id,
                itemType: client_1.ItemType.RAW_MATERIAL,
                unitePrice: payload.initialStock.uniterPrice,
                quantityAdd: payload.initialStock.quantityAdd,
                date: payload.initialStock.date,
                Journal: {
                    create: {
                        debitAmount: payload.initialStock.quantityAdd,
                        narration: "Initial raw material balance",
                    },
                },
            },
        });
    }
    return result;
});
const getAllRawMaterial = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.rawMaterial.findMany();
    return result;
});
const getRawMaterialById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.rawMaterial.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    return result;
});
const updateRawMaterial = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.rawMaterial.findFirst({
        where: { id },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No material found");
    }
    const result = yield prisma_1.default.rawMaterial.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteRawMaterial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.rawMaterial.findFirst({
        where: {
            id,
        },
    });
    if (!isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No material found");
    }
    const result = yield prisma_1.default.rawMaterial.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.RowMaterialsService = {
    createRawMaterial,
    getAllRawMaterial,
    getRawMaterialById,
    updateRawMaterial,
    deleteRawMaterial,
};
