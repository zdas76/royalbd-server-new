import { Secret } from "jsonwebtoken";
import StatusCodes from "http-status-codes";
import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcryptjs";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import emailSender from "./emailSender";

const loginUser = async (payLoad: { userName: string; password: string }) => {
  const userData = await prisma.user.findFirst({
    where: {
      userName: payLoad.userName,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new Error("User name or password not found");
  }

  const isCurrentPasword = await bcrypt.compare(
    payLoad.password,
    userData?.password as string
  );

  if (!isCurrentPasword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData?.userName,
      role: userData?.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData?.userName,
      role: userData?.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData?.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let userData;
  try {
    userData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
  }

  const checkUser = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { emil: checkUser.email, role: checkUser.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    changePassword: checkUser.needPasswordChange,
  };
};

const changePassword = async (
  user: { email: string; role: string; iat: number; exp: number },
  data: { olePassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    data.olePassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
  }
  const hassPassWord: string = await bcrypt.hash(data.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hassPassWord,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password Change Succesfully",
  };
};

const forgotPassword = async (playLoad: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: playLoad.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );
  const resetPassLink =
    config.reset_pass_link +
    `?email=${userData.email}&token=${resetPasswordToken}`;
  await emailSender(
    userData.email,
    `
    <p> Your password reset link 
    <a href=${resetPassLink}>
      Reset Password
    </a>
    </p>
    `
  );
};

const resetPassword = async (
  token: string,
  payLoad: { email: string; passWord: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payLoad.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Your are not Authorized");
  }
  const hassPassWord: string = await bcrypt.hash(payLoad.passWord, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hassPassWord,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  forgotPassword,
  changePassword,
  resetPassword,
};
