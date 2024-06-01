import { AppDataSource } from "../lib/data-source";
import { Task } from "../entities/task.entity";
import { User_task } from "../entities/user_task.entity";
import { Special_Task } from "../entities/special_task.entity";
import { League_Task } from "../entities/league_task.entity";
import { Ref_Task } from "../entities/ref_task.entity";

const taskRepository = AppDataSource.getRepository(Task);
const specialTaskRepository = AppDataSource.getRepository(Special_Task);
const leagueTaskRepository = AppDataSource.getRepository(League_Task);
const refTaskRepository = AppDataSource.getRepository(Ref_Task);
const userTaskRepository = AppDataSource.getRepository(User_task);

export const createNewTask = async (input: Partial<Task>) => {
  return await taskRepository.save(taskRepository.create(input));
};

export const createSpecialTask = async (input: Partial<Special_Task>) => {
  return await specialTaskRepository.save(specialTaskRepository.create(input));
};

export const createLeagueTask = async (input: Partial<League_Task>) => {
  return await leagueTaskRepository.save(leagueTaskRepository.create(input));
};

export const createRefTask = async (input: Partial<Ref_Task>) => {
  return await refTaskRepository.save(refTaskRepository.create(input));
};

export const updateTaskData = async (id: any, data: Task) => {
  return await taskRepository.update({ id }, data);
};

export const findOneTask = async (id: string) => {
  return await taskRepository.findOne({ where: { id } });
};

export const findOneSpecialTask = async (id: string) => {
  return await specialTaskRepository.findOne({ where: { id } });
};

export const findOneRefTask = async (id: string) => {
  return await refTaskRepository.findOne({ where: { id } });
};

export const findOneLeagueTask = async (id: string) => {
  return await leagueTaskRepository.findOne({ where: { id } });
};

export const findAllSpecialTask = async () => {
  return await specialTaskRepository.find();
};

export const findAllLeagueTask = async () => {
  return await leagueTaskRepository.find();
};

export const findAllRefTask = async () => {
  return await refTaskRepository.find();
};

export const submit_task = async (input: Partial<User_task>) => {
  return await userTaskRepository.save(userTaskRepository.create(input));
};

