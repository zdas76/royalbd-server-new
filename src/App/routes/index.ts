import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.router";
import { CategoryRouter } from "../modules/Category/category.route";
import { SubCategoryRouter } from "../modules/SubCategory/subCategory.route";
import { EmployeeRoute } from "../modules/Employee/employee.route";
import { PartyRoute } from "../modules/Party/party.route";
import { AccountItemRoute } from "../modules/AccountsItem/AccountsItem.route";
import { PhillersRoute } from "../modules/Pilliers/piller.route";
import { UnitRoute } from "../modules/unit/unit.route";
import { ProductRoute } from "../modules/products/product.route";
import { InventoryRoute } from "../modules/inventories/inventories.route";
import { RawMaterialRoute } from "../modules/rawMaterials/raw.route";
import { JournalRoute } from "../modules/journal/journal.route";
import { BankRoute } from "../modules/bank/bank.route";
import { TransactionRoute } from "../modules/bankTransaction/transaction.route";
import { CustomerRouter } from "../modules/customer/customer.route";
import { LogCategoryRoute } from "../modules/LogCategory/logCategory.route";
import { GradesRoutes } from "../modules/Grades/grades.route";
import { GradesOrderRouter } from "../modules/GradesOrders/gOrder.route";
import { createProductRoute } from "../modules/createProduce/createProduct.route";
import { LogtoRawRoute } from "../modules/LogtoRowMaterial/logToRaw.route";

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
  {
    path: "/unit",
    route: UnitRoute,
  },
  {
    path: "/product",
    route: ProductRoute,
  },
  {
    path: "/raw_material",
    route: RawMaterialRoute,
  },
  {
    path: "/inventory",
    route: InventoryRoute,
  },
  {
    path: "/journal",
    route: JournalRoute,
  },
  {
    path: "/bank",
    route: BankRoute,
  },
  {
    path: "/transaction",
    route: TransactionRoute,
  },
  {
    path: "/customer",
    route: CustomerRouter,
  },
  {
    path: "/log",
    route: LogCategoryRoute,
  },
  {
    path: "/grades",
    route: GradesRoutes,
  },
  {
    path: "/gorder",
    route: GradesOrderRouter,
  },
  {
    path: "/create-product",
    route: createProductRoute,
  },
  {
    path: "/log-to-raw",
    route: LogtoRawRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
