import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import AppError from "../errors/AppError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorize");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw Error("Forbidden!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
