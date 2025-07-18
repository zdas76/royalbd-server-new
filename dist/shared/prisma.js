"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
        {
            emit: "event",
            level: "error",
        },
        {
            emit: "event",
            level: "info",
        },
        {
            emit: "event",
            level: "warn",
        },
    ],
});
// prisma.$on("query", (e) => {
//   console.log("-------------------------------------------");
//   console.log("Query: " + e.query);
//   console.log("-------------------------------------------");
//   console.log("Params: " + e.params);
//   console.log("-------------------------------------------");
//   console.log("Duration: " + e.duration + "ms");
//   console.log("-------------------------------------------");
// });
// prisma.$on("warn", (e) => {
//   console.log(e);
// });
// prisma.$on("info", (e) => {
//   console.log(e);
// });
// prisma.$on("error", (e) => {
//   console.log(e);
// });
exports.default = prisma;
