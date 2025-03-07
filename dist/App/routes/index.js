"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/Auth/auth.router");
const category_route_1 = require("../modules/Category/category.route");
const subCategory_route_1 = require("../modules/SubCategory/subCategory.route");
const employee_route_1 = require("../modules/Employee/employee.route");
const party_route_1 = require("../modules/Party/party.route");
const AccountsItem_route_1 = require("../modules/AccountsItem/AccountsItem.route");
const piller_route_1 = require("../modules/Pilliers/piller.route");
const router = express_1.default.Router();
const moduleRoutes = [
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
        route: piller_route_1.PhillersRoute,
    },
    {
        path: "/employee",
        route: employee_route_1.EmployeeRoute,
    },
    {
        path: "/party",
        route: party_route_1.PartyRoute,
    },
    {
        path: "/accounts_item",
        route: AccountsItem_route_1.AccountItemRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
