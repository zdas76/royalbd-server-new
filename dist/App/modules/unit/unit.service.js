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
exports.UnitService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_codes_1 = require("http-status-codes");
const createUnit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.unit.findFirst({
        where: {
            name: payload.name,
        },
    });
    if (isExist) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This name already use");
    }
    const result = yield prisma_1.default.unit.create({
        data: payload,
    });
    return result;
});
const getAllUnit = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.findMany();
    return result;
});
const getUnitById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.findFirst({
        where: {
            id: id,
        },
    });
    return result;
});
const updateUnit = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.unit.update({
        where: {
            id: id,
        },
        data: {
            name: payload.name,
        },
    });
    return result;
});
exports.UnitService = {
    createUnit,
    getAllUnit,
    getUnitById,
    updateUnit,
};
