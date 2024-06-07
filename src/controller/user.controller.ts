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
import { rankThresholds } from "../lib/constant";

let userIntervals: { [key: string]: NodeJS.Timeout } = {};

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

    if (!user) return;

    res.status(200).json({
      status: "success",
      data: {
        user: {
          ...user,
          totalPoint: user?.points + user?.referalPoints + user?.socialPoints,
        },
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

    const gKey = `${userId}-guru`;
    const updateUser = await user.save();

    if (!userIntervals[gKey]) {
      if (user.limit < user.max) {
        userIntervals[gKey] = setInterval(async () => {
          user.tapGuru = { ...updateUser.tapGuru, active: false };
          if (user.limit === user.max) {
            clearInterval(userIntervals[gKey]);
            delete userIntervals[gKey];
            console.log(`tap guru`);
          }
          await user.save();
          console.log(`guru limit`);
        }, 20000);
      } else {
        clearInterval(userIntervals[gKey]);
      }
    }
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
    user.perclick += 1;

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

    if (!userIntervals[userId]) {
      if (user.limit < user.max) {
        userIntervals[userId] = setInterval(async () => {
          user.limit += 1;

          if (user.limit === user.max) {
            clearInterval(userIntervals[userId]);
            delete userIntervals[userId];
            console.log(`User ${userId} reached max points: ${user.limit}`);
          }
          await user.save();
          console.log(`User ${userId} points: ${user.limit}`);
        }, 1000);
      } else {
        clearInterval(userIntervals[userId]);
      }
    }

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateChargeLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { point, limit } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.points -= point;
    user.limit = limit;
    user.max = limit;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateRefillSpeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { point, speed } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.points -= point;
    user.refillSpeed = speed;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserBadges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: "success",
      badges: rankThresholds,
    });
  } catch (err: any) {
    next(err);
  }
};
