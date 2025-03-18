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
exports.EmployeeService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../../config"));
const paginationHelpers_1 = require("../../../helpars/paginationHelpers");
const employee_constant_1 = require("./employee.constant");
const creatEmployeeToDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.employee.photo = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename;
    const hashedPassword = bcryptjs_1.default.hashSync(req.body.employee.password, parseInt(config_1.default.hash_round));
    const createEmployee = yield prisma_1.default.employee.create({
        data: {
            email: req.body.employee.email,
            password: hashedPassword,
            name: req.body.employee.name,
            nid: req.body.employee.nid,
            dob: req.body.employee.dob,
            workingPlase: req.body.employee.workingPlase,
            photo: req.body.employee.photo,
            address: req.body.employee.address,
            mobile: req.body.employee.mobile,
        },
        select: {
            id: true,
            email: true,
            name: true,
            nid: true,
            dob: true,
            workingPlase: true,
            photo: true,
            address: true,
            mobile: true,
            role: true,
            status: true,
        },
    });
    return createEmployee;
});
const getAllemployee = (params, paginat) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelpers_1.paginationHelper.Pagination(paginat);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondition = [];
    if (params.searchTerm) {
        andCondition.push({
            OR: employee_constant_1.UserSearchAbleFields.map((field) => ({
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
    const wehreConditions = andCondition.length > 0
        ? { AND: andCondition }
        : { status: client_1.UserStatus.ACTIVE };
    const result = yield prisma_1.default.employee.findMany({
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
            name: true,
            nid: true,
            dob: true,
            workingPlase: true,
            photo: true,
            address: true,
            mobile: true,
            role: true,
            status: true,
        },
    });
    const total = yield prisma_1.default.employee.count({
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
const getEmployeeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.employee.findFirst({
        where: {
            id: id,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            name: true,
            nid: true,
            dob: true,
            workingPlase: true,
            photo: true,
            address: true,
            mobile: true,
            role: true,
            status: true,
        },
    });
    return result;
});
const updateEmployeeById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.employee.update({
        where: {
            id: id,
            status: client_1.UserStatus.ACTIVE,
        },
        data: payload,
    });
    return result;
});
const deleteEmployeeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const result = yield prisma_1.default.employee.update({
        where: {
            id: id,
            status: client_1.UserStatus.ACTIVE,
        },
        data: {
            status: client_1.UserStatus.DELETED,
        },
    });
    return result;
});
exports.EmployeeService = {
    creatEmployeeToDB,
    getAllemployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployeeById,
};
