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
exports.PillersService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createPliersItemIntoDB = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(payLoad);
    const result = yield prisma_1.default.accountMainPiller.create({
        data: payLoad,
    });
    return result;
});
const getAllPillerItem = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.accountMainPiller.findMany();
    return result;
});
exports.PillersService = {
    createPliersItemIntoDB,
    getAllPillerItem,
};
