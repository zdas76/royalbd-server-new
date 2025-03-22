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
exports.InventoryService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createInventory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const checkData = payload.map((item) => {
        if (item.type == "RAW_MATERIAL") {
            return rawMaterialIsExist({ id: item.id });
        }
        else {
            return porductIsExist({ id: item.id });
        }
    });
    if (!checkData) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_GATEWAY, "No Data found");
    }
    const result = yield prisma_1.default.inventory.createMany({
        data: payload,
    });
    return result;
});
const getInventory = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.findMany();
});
const getInventoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.findFirst({
        where: {
            id,
        },
    });
});
const updateInventory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.updateMany({
        where: {},
        data: {},
    });
});
const deleteInventory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return console.log("first");
});
exports.InventoryService = {
    createInventory,
    getInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
};
function porductIsExist(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.product.findFirst({
            where: data,
        });
    });
}
function rawMaterialIsExist(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prisma_1.default.rawMaterial.findFirst({
            where: data,
        });
    });
}
