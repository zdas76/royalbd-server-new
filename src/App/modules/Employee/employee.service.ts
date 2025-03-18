import { Employee, Prisma, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import config from "../../../config";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelpers";

import { Request } from "express";
import { UserSearchAbleFields } from "./employee.constant";

const creatEmployeeToDB = async (req: Request): Promise<Partial<Employee>> => {
  req.body.employee.photo = req?.file?.filename;

  const hashedPassword = bcrypt.hashSync(
    req.body.employee.password,
    parseInt(config.hash_round as any)
  );

  const createEmployee = await prisma.employee.create({
    data: {
      email: req.body.employee.email,
      password: hashedPassword,
      name: req.body.employee.name,
      nid: req.body.employee.nid,
      dob: req.body.employee.dob,
      workingPlase: req.body.employee.workingPlase,
      photo: req.body.employee.photo,
      address: req.body.employee.address,
      mobile: req.body.employee.mobile,
    },
    select: {
      id: true,
      email: true,
      name: true,
      nid: true,
      dob: true,
      workingPlase: true,
      photo: true,
      address: true,
      mobile: true,
      role: true,
      status: true,
    },
  });
  return createEmployee;
};

const getAllemployee = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.EmployeeWhereInput[] = [];

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

  const wehreConditions: Prisma.EmployeeWhereInput =
    andCondition.length > 0
      ? { AND: andCondition }
      : { status: UserStatus.ACTIVE };

  const result = await prisma.employee.findMany({
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
      name: true,
      nid: true,
      dob: true,
      workingPlase: true,
      photo: true,
      address: true,
      mobile: true,
      role: true,
      status: true,
    },
  });

  const total = await prisma.employee.count({
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

const getEmployeeById = async (id: number) => {
  const result = await prisma.employee.findFirst({
    where: {
      id: id,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      name: true,
      nid: true,
      dob: true,
      workingPlase: true,
      photo: true,
      address: true,
      mobile: true,
      role: true,
      status: true,
    },
  });

  return result;
};

const updateEmployeeById = async (id: number, payload: Partial<Employee>) => {
  const result = await prisma.employee.update({
    where: {
      id: id,
      status: UserStatus.ACTIVE,
    },
    data: payload,
  });

  return result;
};

const deleteEmployeeById = async (id: number) => {
  console.log(id);
  const result = await prisma.employee.update({
    where: {
      id: id,
      status: UserStatus.ACTIVE,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  return result;
};

export const EmployeeService = {
  creatEmployeeToDB,
  getAllemployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
