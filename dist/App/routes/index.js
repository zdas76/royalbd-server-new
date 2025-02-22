"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_router_1 = require("../modules/Auth/auth.router");
const category_route_1 = require("../modules/Category/category.route");
const subCategory_route_1 = require("../modules/SubCategory/subCategory.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRouter,
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRouter,
    },
    {
        path: "/sub-category",
        route: subCategory_route_1.SubCategoryRouter,
    },
    {
        path: "/account_pillers",
        route: subCategory_route_1.SubCategoryRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
