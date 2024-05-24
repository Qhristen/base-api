import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser, findOneUser } from "../services/user.services";

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      full_name,
      telegramUserId,
      telegramUserName,
      referredBy,
      referralLink,
    } = req.body;

    const newUser = await createUser({
      full_name,
      telegramUserId,
      telegramUserName,
      referredBy,
      referralLink,
    });

    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "user created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findOneUser(req.params.userId);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
