import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.router";
import { CategoryRouter } from "../modules/Category/category.route";
import { SubCategoryRouter } from "../modules/SubCategory/subCategory.route";
import { EmployeeRoute } from "../modules/Employee/employee.route";
import { PartyRoute } from "../modules/Party/party.route";
import { AccountItemRoute } from "../modules/AccountsItem/AccountsItem.route";
import { PhillersRoute } from "../modules/Pilliers/piller.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/category",
    route: CategoryRouter,
  },
  {
    path: "/sub-category",
    route: SubCategoryRouter,
  },
  {
    path: "/account_pillers",
    route: PhillersRoute,
  },
  {
    path: "/employee",
    route: EmployeeRoute,
  },
  {
    path: "/party",
    route: PartyRoute,
  },
  {
    path: "/accounts_item",
    route: AccountItemRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
