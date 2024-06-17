import { NextFunction, Request, Response } from "express";
import { rankThresholds } from "../lib/constant";
import { CreateUserInput } from "../schema/user.schema";
import {
  addPoints,
  addTouches,
  baseStats,
  checkMilestoneRewards,
  createUser,
  findAllUsers,
  findOneUser,
  findUserReferers,
  updateLastInteraction,
  updateRank,
} from "../services/user.services";
import AppError from "../lib/appError";
import { findAllLeagueTask, findAllRefTask } from "../services/task.services";

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
    
    const user = await findOneUser(userId);
    
    if (!user) return;
    await checkMilestoneRewards(user.telegramUserId);
    await updateRank(user.telegramUserId);
    await updateLastInteraction(String(userId));

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

export const getAllUsersRferrals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referals = await findUserReferers(req.params.userId);

    const mapedReferals = await Promise.all(referals.map(async (referal) => {
      const from = await findOneUser(referal.referredFromId);
      const to = await findOneUser(referal.referredToId);
      return {
        referredFrom: from,
        referredTo: to,
        point: referal.point
      };
    }));

    return res.status(200).json({
      status: "success",
      data: mapedReferals,
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

    await addTouches(userId, point);
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

    if (!user) return;

    user.tapGuru = { min: min, active, max };
    await updateLastInteraction(String(userId));

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
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

    user.totalPoint -= point;
    user.perclick += 1;
    user.multiTapLevel += 1;
    user.multiTapPoint = user.multiTapPoint * 2;

    await updateLastInteraction(String(userId));

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: updatedUser,
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
    await updateLastInteraction(String(userId));

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
    await updateLastInteraction(String(userId));

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

    await updateLastInteraction(String(userId));
    const user = await findOneUser(userId);

    if (!user) return;

    if (user.totalPoint < point) {
      return next(
        new AppError(
          500,
          "you do not have a enough point to purchase charge limit"
        )
      );
    }

    user.totalPoint -= point * 2;
    user.limit = limit;
    user.max = limit;
    user.chargeLevel += 1;

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

    user.totalPoint -= point;
    user.refillSpeed = speed;
    user.refillLevel += 1;
    user.refillPoint += user.refillPoint * 2;

    const updatedUser = await user.save();
    await updateLastInteraction(String(userId));

    res.status(200).json({
      status: "success",
      user: updatedUser,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserelcomePage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    user.welcomePage = true;
    const updatedUser = await user.save();
    await updateLastInteraction(String(userId));

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
    const badges = await findAllLeagueTask()
    res.status(200).json({
      status: "success",
      badges: badges,
    });
  } catch (err: any) {
    next(err);
  }
};
