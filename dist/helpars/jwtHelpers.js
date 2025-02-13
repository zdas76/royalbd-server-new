"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
//     const token = jwt.sign(
//         payload,
//         secret,
//         {
//             algorithm: 'HS256',
//             expiresIn
//         }
//     );
//     return token;
// };
const generateToken = (payload, secret, expiresIn) => {
    try {
        return jsonwebtoken_1.default.sign(payload, secret, {
            algorithm: 'HS256',
            expiresIn
        });
    }
    catch (error) {
        console.error('JWT Token Generation Error:', error);
        throw error;
    }
};
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
0;
exports.jwtHelpers = {
    generateToken,
    verifyToken
};
