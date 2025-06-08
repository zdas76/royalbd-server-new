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
exports.CreateProductServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createProductInfo = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const addProduct = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        // 1. check product item
        const isProductExisted = yield prisma_1.default.product.findFirst({
            where: {
                id: payLoad.product.id,
                itemType: client_1.ItemType.PRODUCT,
                isDeleted: false,
            },
        });
        if (!isProductExisted) {
            throw new Error(`Invalid Product name.`);
        }
        const productInventory = {
            productId: isProductExisted.id,
            itemType: client_1.ItemType.PRODUCT,
            quantityAdd: (_a = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _a === void 0 ? void 0 : _a.quantity,
            unitePrice: (_b = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _b === void 0 ? void 0 : _b.unitcost,
        };
        // 2. add Raw Materials
        const isRawMaterialExisted = payLoad.rowMaterials.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            return yield prisma_1.default.product.findFirst({
                where: {
                    id: item.rowMaterialsId,
                    itemType: client_1.ItemType.RAW_MATERIAL,
                    isDeleted: false,
                },
            });
        }));
        if (!isRawMaterialExisted) {
            throw new Error(`Invalid raw material.`);
        }
        const rowMaterialInventory = payLoad.rowMaterials.map((item) => ({
            rawId: item.rowMaterialsId,
            itemType: client_1.ItemType.RAW_MATERIAL,
            quantityLess: item.quantity,
            unitePrice: item.rowUnitprice,
        }));
        const InventoryItem = [...rowMaterialInventory, productInventory];
        // Step 3: Prepare Journal Credit Entries (For Payment Accounts)
        const costItemsJournal = payLoad.expenses.map((item) => ({
            accountsItem: {
                connect: { id: item.accountsItemId },
            },
            debitAmount: item.amount,
            narration: item.narration || "",
        }));
        // step 4: Prepare product Journal
        const productJournal = {
            inventoryItem: {
                connect: { id: (_c = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _c === void 0 ? void 0 : _c.productId },
            },
            debitAmount: (_d = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _d === void 0 ? void 0 : _d.amount,
            narration: ((_e = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _e === void 0 ? void 0 : _e.narration) || "",
        };
        //Step: 5: create Raw Material Journal
        const rowMaterialJournal = payLoad.rowMaterials.map((item) => {
            var _a, _b;
            return ({
                inventoryItem: {
                    connect: { id: item.rowMaterialsId },
                },
                creditAmount: (_a = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _a === void 0 ? void 0 : _a.amount,
                narration: ((_b = payLoad === null || payLoad === void 0 ? void 0 : payLoad.product) === null || _b === void 0 ? void 0 : _b.narration) || "",
            });
        });
        const journalItem = [
            ...costItemsJournal,
            productJournal,
            ...rowMaterialJournal,
        ];
        const createProduct = tx.createProduct.create({
            data: {
                voucherNo: payLoad.voucherNo,
                date: payLoad.date,
                inventory: {
                    create: InventoryItem,
                },
                journal: {
                    create: journalItem,
                },
            },
            include: {
                inventory: true,
                journal: {
                    include: {
                        accountsItem: true,
                        inventoryItem: true,
                    },
                },
            },
        });
        return createProduct;
    }));
    const getCreatedProduct = yield prisma_1.default.createProduct.findFirst({
        where: {
            id: addProduct === null || addProduct === void 0 ? void 0 : addProduct.id,
        },
        include: {
            journal: true,
            inventory: true,
        },
    });
    return getCreatedProduct;
});
exports.CreateProductServices = {
    createProductInfo,
};
