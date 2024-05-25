import { AppDataSource } from "../lib/data-source";
import { Boost } from "../entities/boost.entity";
import { User_boost } from "../entities/user_boost.entity";

const boostRepository = AppDataSource.getRepository(Boost);
const userBootRepository = AppDataSource.getRepository(User_boost);

export const createNewBoost = async (input: Partial<Boost>) => {
  return await boostRepository.save(boostRepository.create(input));
};

export const updateBoostData = async (id: any, data: Boost) => {
  return await boostRepository.update({ id }, data);
};

export const findOneBoost = async (id: string) => {
  return await boostRepository.findOne({ where: { id } });
};

export const findAllBoostByType = async (type: string) => {
  return await boostRepository.find({ where: { type } });
};

export const submit_boost = async (input: Partial<User_boost>) => {
  return await userBootRepository.save(userBootRepository.create(input));
};