"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcryptjs"));
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findFirst({
        where: {
            userName: payLoad.userName,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new Error("User name or password not found");
    }
    const isCurrentPasword = yield bcrypt.compare(payLoad.password, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isCurrentPasword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        userName: userData === null || userData === void 0 ? void 0 : userData.userName,
        email: userData === null || userData === void 0 ? void 0 : userData.userName,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({
        userName: userData === null || userData === void 0 ? void 0 : userData.userName,
        email: userData === null || userData === void 0 ? void 0 : userData.userName,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
    }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData === null || userData === void 0 ? void 0 : userData.needPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let userData;
    try {
        userData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const checkUser = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ emil: checkUser.email, role: checkUser.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
        changePassword: checkUser.needPasswordChange,
    };
});
const changePassword = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(data.olePassword, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = yield bcrypt.hash(data.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE,
        },
        data: {
            password: hassPassWord,
            needPasswordChange: false,
        },
    });
    return {
        message: "Password Change Succesfully",
    };
});
const forgotPassword = (playLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: playLoad.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.reset_pass_secret, config_1.default.jwt.reset_pass_token_expires_in);
    const resetPassLink = config_1.default.reset_pass_link +
        `?email=${userData.email}&token=${resetPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
    <p> Your password reset link 
    <a href=${resetPassLink}>
      Reset Password
    </a>
    </p>
    `);
});
const resetPassword = (token, payLoad) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payLoad.email,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.reset_pass_secret);
    if (!isValidToken) {
        throw new ApiError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your are not Authorized");
    }
    const hassPassWord = yield bcrypt.hash(payLoad.passWord, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
            status: client_1.UserStatus.ACTIVE,
        },
        data: {
            password: hassPassWord,
        },
    });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    forgotPassword,
    changePassword,
    resetPassword,
};
