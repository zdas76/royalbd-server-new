"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (error) => {
    const match = error.message.match(/"([^"]*)"/);
    const errorMessage = match && match[1];
    const errorSources = [
        { path: "", message: `${errorMessage} is already exists` },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: "Validation Error",
        errorSources,
    };
};
exports.default = handleDuplicateError;
