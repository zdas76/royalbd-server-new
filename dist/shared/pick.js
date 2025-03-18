"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pick = (obj, keys) => {
    const fielderObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            fielderObj[key] = obj[key];
        }
    }
    return fielderObj;
};
exports.default = pick;
