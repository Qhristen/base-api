import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
  return await userRepository.save(userRepository.create(input));
};

export const updateUserData = async (id: any, data: User) => {
  return await userRepository.update({ telegramUserId: id }, data);
};

export const findOneUser = async (id: string) => {
  return await userRepository.findOne({ where: { telegramUserId: id } });
};
