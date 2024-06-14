import { NextFunction, Request, Response } from "express";
import {
  createNewBoost,
  findAllBoostByType,
  findOneBoost,
  submit_boost,
} from "../services/boost.services";
import { CreateBoostInput } from "../schema/boost.schema";
import { findOneUser } from "../services/user.services";
import { startCronJob } from "../lib/auto_bot_cron_jobs";

export const createBoost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, limit, type, max, point } = req.body;
    console.log(req.body, "nwt");

    const newTask = await createNewBoost({
      name,
      limit,
      type,
      max,
      point,
    });
    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "boost created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const getSingleBoost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findOneBoost(req.params.boostId);
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

export const getAllBoostByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const boost = await findAllBoostByType(req.params.type);
    res.status(200).json({
      status: "success",
      data: {
        boost,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const submitBoost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boostId, userId, status } = req.body;

    const newTask = await submit_boost({
      boostId,
      userId,
      status,
    });

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "task submitted",
    });
  } catch (err: any) {
    next(err);
  }
};

export const buyAutoBot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { point } = req.body;

    const user = await findOneUser(req.params.userId);
    if (!user) return;

    user.totalPoint -= point;
    user.autobot = true;

    await user.save();

    startCronJob();
    
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

export const claimAutoBotPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { point } = req.body;

    const user = await findOneUser(req.params.userId);
    if (!user) return;

    user.totalPoint += point;
    user.autoBotpoints = 0

    await user.save();

    startCronJob();

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
