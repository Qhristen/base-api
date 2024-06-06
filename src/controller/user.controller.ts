import { NextFunction, Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import {
  addPoints,
  baseStats,
  createUser,
  findAllUsers,
  findOneUser,
  removePoints,
  updateLastInteraction,
  updateUser,
} from "../services/user.services";

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
    const userId = req.params.userId;
    await updateLastInteraction(String(userId));

    const user = await findOneUser(userId);
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findAllUsers();
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const addUserPoint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { point } = req.body;
    const userId = req.params.userId;
    console.log(point);
    await addPoints(userId, point, point);
    res.status(200).json({
      status: "success",
      point,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await baseStats();
    res.status(200).json({
      status: "success",
      stats,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserTapGuru = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { min, max, active } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);
    console.log(req.body);

    if (!user) return;

    user.tapGuru = {
      min,
      active,
      max,
    };

    const updateUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updateUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserMultitap = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { point } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.points -= point;
    user.multiTap += 1;

    user.save();

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserFullEnergyBar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { min, max, active, limit } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.limit = limit;
    user.max = limit;
    user.fullEnergy = {
      min,
      active,
      max,
    };

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { min, max } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.limit = min;
    user.max = max;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};
