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
        if (item.itemType == "RAW_MATERIAL") {
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
    return yield prisma_1.default.inventory.findMany({
        include: {
            Journal: true,
        },
    });
});
const getInventoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.inventory.findFirst({
        where: {
            id,
        },
        include: {
            Journal: true,
            product: true,
            raWMaterial: true,
        },
    });
});
const getInventoryAggValueById = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$queryRaw `
  SELECT 
    i.productId,
    
    SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    SUM(IFNULL(j.debitAmount, 0)- IFNULL(j.creditAmount, 0)) AS netAmount
  FROM inventories i
  LEFT JOIN journals j ON j.inventoryItemId = i.id
  GROUP BY i.productId`;
    //   const startDate = "2025-06-01";
    //   const endDate = "2025-06-06";
    //   const result = await prisma.$queryRaw<
    //     Array<{
    //       productId: number | null;
    //       netQuantity: number;
    //       netJournalAmount: number;
    //     }>
    //   >(Prisma.sql`
    //   SELECT
    //     i.productId,
    //     SUM(IFNULL(i.quantityAdd, 0) - IFNULL(i.quantityLess, 0)) AS netQuantity,
    //     SUM(IFNULL(j.debitAmount, 0) - IFNULL(j.creditAmount, 0)) AS netJournalAmount
    //   FROM inventories i
    //   LEFT JOIN journals j ON j.inventoryItemId = i.id
    //   WHERE DATE(i.createdAt) BETWEEN ${startDate} AND ${endDate}
    //   GROUP BY i.productId
    // `);
    return result;
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
