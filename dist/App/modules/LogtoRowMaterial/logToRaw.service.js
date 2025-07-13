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
const createLogToRowIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const createLogOrdrByCategory = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const isExistedLogCagetory = yield Promise.all(((_a = payLoad === null || payLoad === void 0 ? void 0 : payLoad.logs) === null || _a === void 0 ? void 0 : _a.map((log) => __awaiter(void 0, void 0, void 0, function* () {
            return yield tx.logCategory.findFirst({
                where: {
                    id: log.logCategoryId,
                },
            });
        }))) || []);
        const invalidCategory = isExistedLogCagetory.some((category) => category === null);
        if (invalidCategory) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Log Category is not existed");
        }
        const isExistedRaw = yield Promise.all(((_b = payLoad === null || payLoad === void 0 ? void 0 : payLoad.logs) === null || _b === void 0 ? void 0 : _b.map((log) => __awaiter(void 0, void 0, void 0, function* () {
            return yield tx.rawMaterial.findFirst({
                where: {
                    id: log.rawId,
                },
            });
        }))) || []);
        const invalidrawMaterial = isExistedRaw.some((raw) => raw === null);
        if (invalidrawMaterial) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Raw Material is not existed");
        }
        const createLogToRaw = yield tx.logToRaw.create({
            data: {
                date: new Date(payLoad.date),
                voucherNo: payLoad.vaucher,
            },
        });
        const logOrderByCategoryData = yield Promise.all((_c = payLoad === null || payLoad === void 0 ? void 0 : payLoad.logs) === null || _c === void 0 ? void 0 : _c.map((log) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                logCategoryId: log.logCategoryId,
                logToRawId: createLogToRaw.id,
                date: new Date(payLoad.date),
                quantityLess: log.quantity,
                creditAmount: log.amount,
                unitPrice: Number((log.amount / log.quantity).toFixed(2)),
            });
        })));
        yield tx.logOrdByCategory.createMany({
            data: logOrderByCategoryData,
        });
        // Create inventory with nested journal using individual create calls
        for (const log of payLoad.logs) {
            const unitPrice = Number((log.amount / log.quantity).toFixed(2));
            yield tx.inventory.create({
                data: {
                    date: new Date(payLoad.date),
                    logToRawId: createLogToRaw.id,
                    rawId: log.rawId,
                    quantityAdd: log.quantity,
                    unitPrice: unitPrice,
                    journal: {
                        create: {
                            date: new Date(payLoad.date),
                            creditAmount: log.amount,
                            narration: "Log convert to raw material",
                        },
                    },
                },
            });
        }
        return createLogToRaw;
    }));
    console.log(createLogOrdrByCategory);
    return yield prisma_1.default.logToRaw.findFirst({
        where: {
            id: createLogOrdrByCategory.id,
            voucherNo: createLogOrdrByCategory.voucherNo,
        },
        include: {
            inventory: true,
            logOrdByCategory: true,
        },
    });
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
    createLogToRowIntoDB,
    getAllLogCategory,
    getLogCategoryById,
    updateLogCategoryById,
};
