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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const paginationHelpers_1 = require("../../../helpars/paginationHelpers");
const User_constant_1 = require("./User.constant");
// Create Employee
const creatEmployeeToDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.employee.photo = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, parseInt(config_1.default.hash_round));
    const userData = {
        userName: req.body.employee.userName,
        email: req.body.employee.email,
        password: hashedPassword,
    };
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: userData,
        });
        const createEmployee = yield tx.employee.create({
            data: {
                email: req.body.employee.email,
                name: req.body.employee.name,
                fatherName: req.body.employee.fatherName,
                motherName: req.body.employee.motherName,
                workingPlase: req.body.employee.workingPlase,
                address: req.body.employee.address,
                mobile: req.body.employee.mobile,
                photo: req.body.employee.photo,
            },
        });
        return createEmployee;
    }));
    return result;
});
// Create Admin
const creatAdminToDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.admin.photo = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const hashedPassword = bcryptjs_1.default.hashSync(req.body.password, parseInt(config_1.default.hash_round));
    const userData = {
        userName: req.body.admin.userName,
        email: req.body.admin.email,
        password: hashedPassword,
    };
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.user.create({
            data: userData,
        });
        const createAdmin = yield tx.admin.create({
            data: {
                email: req.body.admin.email,
                name: req.body.admin.name,
                fatherName: req.body.admin.fatherName,
                motherName: req.body.admin.motherName,
                address: req.body.admin.address,
                mobile: req.body.admin.mobile,
                photo: req.body.admin.photo
            },
        });
        return createAdmin;
    }));
    return result;
});
const getAllUserFromBD = (params, paginat) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.Pagination(paginat);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: User_constant_1.UserSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const wehreConditions = andCondition.length > 0 ? { AND: andCondition } : {};
    const result = yield prisma_1.default.user.findMany({
        where: wehreConditions,
        skip,
        take: limit,
        orderBy: paginat.sortBy && paginat.sortOrder
            ? {
                [paginat.sortBy]: paginat.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            admin: true,
            employee: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: wehreConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.UserService = {
    creatEmployeeToDB,
    creatAdminToDB,
    getAllUserFromBD
};
