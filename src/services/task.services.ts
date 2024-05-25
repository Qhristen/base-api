import { AppDataSource } from "../lib/data-source";
import { Task } from "../entities/task.entity";
import { User_task } from "../entities/user_task.entity";

const taskRepository = AppDataSource.getRepository(Task);
const userTaskRepository = AppDataSource.getRepository(User_task);

export const createNewTask = async (input: Partial<Task>) => {
  return await taskRepository.save(taskRepository.create(input));
};

export const updateTaskData = async (id: any, data: Task) => {
  return await taskRepository.update({ id }, data);
};

export const findOneTask = async (id: string) => {
  return await taskRepository.findOne({ where: { id } });
};

export const findAllTaskByType = async (type: string) => {
  return await taskRepository.find({ where: { type } });
};

export const submit_task = async (input: Partial<User_task>) => {
  return await userTaskRepository.save(userTaskRepository.create(input));
};

