import { Request } from "express";
import prisma from "../../../shared/prisma";
import { Admin, Employee, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { UserSearchAbleFields } from "./User.constant";


// Create Employee
const creatEmployeeToDB = async (req: Request): Promise<Employee> => {
  req.body.employee.photo = req?.file?.filename;

  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    parseInt(config.hash_round as any)
  );

  const userData = {
    userName: req.body.employee.userName as string,
    email: req.body.employee.email as string,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createEmployee = await tx.employee.create({
      data: {
        email: req.body.employee.email,
        name: req.body.employee.name,
        fatherName: req.body.employee.fatherName,
        motherName: req.body.employee.motherName,
        workingPlase: req.body.employee.workingPlase,
        address: req.body.employee.address,
        mobile: req.body.employee.mobile,
        photo: req.body.employee.photo,
      },
    });
    return createEmployee;
  });

  return result;
};


// Create Admin
const creatAdminToDB = async (req:Request):Promise<Admin> => {
  req.body.admin.photo = req?.file?.filename;

  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    parseInt(config.hash_round as any)
  );

  const userData = {
    userName: req.body.admin.userName as string,
    email: req.body.admin.email as string,
    password: hashedPassword,
  };

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userData,
    });

    const createAdmin = await tx.admin.create({
      data: {
        email: req.body.admin.email,
        name: req.body.admin.name,
        fatherName: req.body.admin.fatherName,
        motherName: req.body.admin.motherName,
        address: req.body.admin.address,
        mobile: req.body.admin.mobile,
        photo: req.body.admin.photo
      },
    });
    return createAdmin;
  });

  return result;
};


const getAllUserFromBD = async (
  params: any,
  paginat: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: UserSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const wehreConditions: Prisma.UserWhereInput =
  andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.user.findMany({
    where: wehreConditions,
    skip,
    take: limit,
    orderBy:
      paginat.sortBy && paginat.sortOrder
        ? {
            [paginat.sortBy]: paginat.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      admin: true,
      employee: true,
      createdAt: true,
      updatedAt: true,
    },
  });


  const total = await prisma.user.count({
    where: wehreConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  creatEmployeeToDB,
  creatAdminToDB,
  getAllUserFromBD
};
