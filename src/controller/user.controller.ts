import { NextFunction, Request, Response } from "express";
import AppError from "../lib/appError";
import { RefillTokenRequirements, tokenRequirements } from "../lib/constant";
import { CreateUserInput } from "../schema/user.schema";
import { findAllLeagueTask } from "../services/task.services";
import {
  addTouches,
  areAllLeagueTasksDone,
  areAllRefTasksDone,
  areAllSpecialActivitiesDone,
  baseStats,
  createUser,
  findAllUsers,
  findOneUser,
  findUserReferers,
  updateLastInteraction,
} from "../services/user.services";

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
    const isSpecialDOne = await areAllSpecialActivitiesDone(user);
    const isRefDone = await areAllRefTasksDone(user);
    const isLeagueDone = await areAllLeagueTasksDone(user);

    await updateLastInteraction(String(userId));
    res.status(200).json({
      status: "success",
      data: {
        user: {
          ...user,
          isSpecialDOne: isSpecialDOne ? true : false,
          isLeagueDone: isLeagueDone ? false : true,
          isRefDone: isRefDone ? false : true,
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

export const getAllUsersRferrals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const referals = await findUserReferers(req.params.userId);

    const mapedReferals = await Promise.all(
      referals.map(async (referal) => {
        const from = await findOneUser(referal.referredFromId);
        const to = await findOneUser(referal.referredToId);
        return {
          referredFrom: from,
          referredTo: to,
          point: referal.point,
        };
      })
    );

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
    const { level } = req.body;
    const { userId } = req.params;

    await updateLastInteraction(String(userId));
    const user = await findOneUser(userId);

    if (!user) return;

    const tokensRequired =
      tokenRequirements[user.multiTapLevel as keyof typeof tokenRequirements];

    if (user.totalPoint >= tokensRequired) {
      user.totalPoint -= tokensRequired;
      user.perclick += 1;
      user.multiTapLevel = level;
      user.multiTapPoint =
        level > 10 ? user.multiTapPoint * 2 : tokenRequirements[level];
    } else {
      return next(new AppError(500, "Not enough tokens to level up."));
    }

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
    const { limit, level } = req.body;
    const { userId } = req.params;

    await updateLastInteraction(String(userId));
    const user = await findOneUser(userId);

    if (!user) return;

    const tokensRequired =
      tokenRequirements[user.chargeLevel as keyof typeof tokenRequirements];

    if (user.totalPoint >= tokensRequired) {
      user.totalPoint -= tokensRequired;
      user.limit = limit;
      user.max = limit;
      user.chargeLimitPoint =
        level > 10 ? user.chargeLimitPoint * 2 : tokenRequirements[level];
      user.chargeLevel = level;
    } else {
      return next(new AppError(500, "Not enough tokens to level up."));
    }

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
    const { speed, level } = req.body;
    const { userId } = req.params;

    const user = await findOneUser(userId);

    if (!user) return;

    const tokensRequired =
      RefillTokenRequirements[
        user.refillLevel as keyof typeof tokenRequirements
      ];

    if (user.totalPoint >= tokensRequired) {
      user.totalPoint -= tokensRequired;
      user.refillSpeed = speed;
      user.refillLevel = level;
      user.refillPoint =
        level > 5 ? user.refillPoint * 2 : RefillTokenRequirements[level];
    } else {
      return next(new AppError(500, "Not enough tokens to level up."));
    }

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
    const badges = await findAllLeagueTask();
    res.status(200).json({
      status: "success",
      badges: badges,
    });
  } catch (err: any) {
    next(err);
  }
};
