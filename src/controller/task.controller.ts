import { NextFunction, Request, Response } from "express";
import { CreateTaskInput } from "../schema/task.schema";
import {
  createNewTask,
  findAllTaskByType,
  findOneTask,
  submit_task,
} from "../services/task.services";

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

export const getSingletask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findOneTask(req.params.taskId);
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

export const submitTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { taskId, userId, status } = req.body;

    const newTask = await submit_task({
      taskId,
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

export const getAllTaskByType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await findAllTaskByType(req.params.type);
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
