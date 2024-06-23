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
  findAllUserActivity,
  findAllUserTask,
  findOneLeagueTask,
  findOneRefTask,
  findOneSpecialTask,
  findOneTask,
  findOneUserActivity,
  submit_activity,
  submit_task,
  submit_user_activity,
} from "../services/task.services";
import {
  addPoints,
  addReferalPoints,
  addSocialPoints,
  findOneUser,
} from "../services/user.services";
import AppError from "../lib/appError";

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

export const getAllUserTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userTask = await findAllUserTask();
    res.status(200).json({
      status: "success",
      userTask,
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
    const { status, name, point, type } = req.body;
    const { taskId, userId } = req.params;
    const task = await findOneSpecialTask(taskId);
    const user = await findOneUser(userId);

    console.log(req.body, "bodu");

    if (!user || !task)
      return next(new AppError(404, "user or task not found"));

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
      user
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

    if (!user) return next(new AppError(404, "user not found"));

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
    const { taskId, userId, status, name, point, type, league } = req.body;
    const task = await findOneLeagueTask(taskId);
    const user = await findOneUser(userId);

    if (!user) return next(new AppError(404, "user not found"));

    await addPoints(user.telegramUserId, point);
    
    // user.league = league
    await user.save()

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

export const submitUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { clicked, activityId } = req.body;
    const { taskId, userId } = req.params;

    const newTask = await submit_user_activity({
      taskId,
      userId,
      clicked,
      activityId,
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

export const getAllUserActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await findAllUserActivity();
    res.status(200).json({
      status: "success",
      data: {
        activity,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUserActivityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const activity = await findOneUserActivity(req.params?.userId);
    res.status(200).json({
      status: "success",
      data: {
        activity,
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
