import { NextFunction, Request, Response } from "express";
import {
  createNewBoost,
  findAllBoostByType,
  findOneBoost,
  submit_boost,
} from "../services/boost.services";
import { CreateBoostInput } from "../schema/boost.schema";

export const createBoost = async (
  req: Request<{}, {}, CreateBoostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, limit, type } = req.body;
    console.log(req.body, "nwt");

    const newTask = await createNewBoost({
      name,
      limit,
      type,
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
