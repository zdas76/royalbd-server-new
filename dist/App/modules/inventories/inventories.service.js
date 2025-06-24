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
const getInventory = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.findMany({
        include: {
            journal: true,
        },
    });
});
const getInventoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.findFirst({
        where: {
            id,
        },
        include: {
            journal: true,
            product: true,
            raWMaterial: true,
        },
    });
});
const getInventoryAggValueById = (query) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(query);
    if (query.itemType == "product") {
        const getDate = yield prisma_1.default.inventory.findFirst({
            where: {
                productId: Number(query.productId),
                isClosing: true,
            },
            orderBy: [{ id: "desc" }],
        });
        const result = yield prisma_1.default.$queryRaw `
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
    
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  WHERE i.productId = ${query.productId} AND i.date=${getDate === null || getDate === void 0 ? void 0 : getDate.date}
  GROUP BY i.productId`;
        return result;
    }
    if (query.itemType == "raw") {
        const getDate = yield prisma_1.default.inventory.findFirst({
            where: {
                rawId: Number(query.rawId),
                isClosing: true,
            },
            orderBy: [{ id: "desc" }],
        });
        if (getDate === null || getDate === void 0 ? void 0 : getDate.date) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "date nor found");
        }
        const result = yield prisma_1.default.$queryRaw `
  SELECT 
    i.rawId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount,
    
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  WHERE i.productId = ${query.rawId} AND i.date=${getDate === null || getDate === void 0 ? void 0 : getDate.date}
  GROUP BY i.rawId`;
        return result;
    }
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
    getInventory,
    getInventoryById,
    getInventoryAggValueById,
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
