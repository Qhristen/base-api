import { NextFunction, Request, Response } from "express";
import { CreateTaskInput } from "../schema/task.schema";
import {
  createLeagueTask,
  createNewTask,
  createRefTask,
  createSpecialTask,
  findAllLeagueTask,
  findAllRefTask,
  findAllSpecialTask,
  findOneLeagueTask,
  findOneRefTask,
  findOneSpecialTask,
  findOneTask,
  submit_task,
} from "../services/task.services";
import {
  addPoints,
  addReferalPoints,
  addSocialPoints,
  findOneUser,
} from "../services/user.services";

export const createTask = async (
  req: Request<{}, {}, CreateTaskInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, point, type, activities } = req.body;

    const newTask = await createNewTask({
      name,
      point,
      type,
      activities,
    });

    console.log(req.body, "nwt");

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "task created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const addSpecialTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, point, activities } = req.body;

    const newTask = await createSpecialTask({
      name,
      point,
      activities,
    });

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "task created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const addLeagueTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, point } = req.body;

    const newTask = await createLeagueTask({
      name,
      point,
    });

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "task created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const addRefTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, point, totalInvite } = req.body;

    const newTask = await createRefTask({
      name,
      point,
      totalInvite,
    });

    await newTask.save();

    res.status(201).json({
      status: "success",
      message: "task created",
    });
  } catch (err: any) {
    next(err);
  }
};

export const getSingletask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findOneTask(req.params.taskId);
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getSingleSpecialTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findOneSpecialTask(req.params.taskId);
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const submitSpecialTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId, userId, status, name, point, type } = req.body;
    const task = await findOneSpecialTask(taskId);
    const user = await findOneUser(userId);

    if (!task || !user || !type) return;

    await addSocialPoints(user.telegramUserId, point);

    const newTask = await submit_task({
      name,
      taskId,
      userId,
      status,
      point,
      type,
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

export const submitRefTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId, userId, status, name, point, type } = req.body;
    const task = await findOneRefTask(taskId);
    const user = await findOneUser(userId);

    if (!task || !user || !type) return;

    await addReferalPoints(user.telegramUserId, point);

    const newTask = await submit_task({
      name,
      taskId,
      userId,
      status,
      point,
      type,
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

export const submitLeagueTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId, userId, status, name, point, type } = req.body;
    const task = await findOneLeagueTask(taskId);
    const user = await findOneUser(userId);

    if (!task || !user || !type) return;

    await addPoints(user.telegramUserId, point, 0);

    const newTask = await submit_task({
      name,
      taskId,
      userId,
      status,
      point,
      type,
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

export const getAllSpecialTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findAllSpecialTask();
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllLeagueTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findAllLeagueTask();
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllRefTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findAllRefTask();
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
