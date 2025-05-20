import { Party, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { StatusCodes } from "http-status-codes";
import { paginationHelper } from "../../../helpars/paginationHelpers";
import { IPaginationOptions } from "../../interfaces/pagination";
import { PartySearchAbleFields } from "./party.constant";
import AppError from "../../errors/AppError";

const getPertyLedgerInfo = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.PartyWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: PartySearchAbleFields.map((field) => ({
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

  const wehreConditions: Prisma.PartyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : { isDeleted: false };

  const result = await prisma.transactionInfo.findMany({
    where: {},
    // where: wehreConditions,
    // skip,
    // take: limit,
    // orderBy:
    //   paginat.sortBy && paginat.sortOrder
    //     ? {
    //         [paginat.sortBy]: paginat.sortOrder,
    //       }
    //     : {
    //         createdAt: "desc",
    //       },
  });

  return result;
};

const createParty = async (payload: Party) => {
  const isExist = await prisma.party.findFirst({
    where: {
      name: payload.name,
      contactNo: payload.contactNo,
      partyType: payload.partyType,
      isDeleted: false,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This User Already Exist");
  }
  const result = await prisma.party.create({
    data: payload,
  });

  return result;
};

const getAllParty = async (params: any, paginat: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.Pagination(paginat);

  const { searchTerm, ...filterData } = params;

  const andCondition: Prisma.PartyWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: PartySearchAbleFields.map((field) => ({
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

  const wehreConditions: Prisma.PartyWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : { isDeleted: false };

  const result = await prisma.party.findMany({
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
  });

  return result;
};

const getPartyById = async (id: number) => {
  const result = await prisma.party.findFirst({
    where: {
      id: id,
    },
  });

  return result;
};

const updatePartyById = async (id: number, payload: Partial<Party>) => {
  const isExist = await prisma.party.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No Party Found ");
  }

  const result = await prisma.party.update({
    where: {
      id: id,
    },
    data: payload,
  });

  return result;
};

const deletePartyById = async (id: number) => {
  console.log(id);
  const isExist = await prisma.party.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!isExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No party found");
  }

  const result = await prisma.party.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const PartyService = {
  getPertyLedgerInfo,
  createParty,
  getAllParty,
  getPartyById,
  updatePartyById,
  deletePartyById,
};
