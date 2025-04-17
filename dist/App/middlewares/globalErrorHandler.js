"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const handelZorError_1 = __importDefault(require("../errors/handelZorError"));
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    if (err instanceof zod_1.ZodError) {
        const simplifedError = (0, handelZorError_1.default)(err);
        statusCode = simplifedError === null || simplifedError === void 0 ? void 0 : simplifedError.statusCode;
        message = simplifedError === null || simplifedError === void 0 ? void 0 : simplifedError.message;
        error = simplifedError.errorSources;
    }
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        message = "Validation Error";
        error = err.message;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            message = "Duplicate error";
            error = err.meta;
        }
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        error = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        error = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    console.log({
        success: false,
        message,
        error,
    });
    res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.default = globalErrorHandler;
