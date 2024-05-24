import { Request, Response } from "express";
import { AppDataSource } from "../lib/data-source";
import { User } from "../entities/user.entity";
import { Bot } from "../lib/telegram";
import { rankThresholds } from "../lib/constant";
import { MoreThan } from "typeorm";

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

export const findOneReferer = async (id: string) => {
  return await userRepository.findOne({ where: { referredBy: id } });
};

export const checkMilestoneRewards = async (userId: string) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (!user) return;

  const milestones = [
    { count: 5, reward: 30000 },
    { count: 10, reward: 100000 },
    { count: 25, reward: 250000 },
    { count: 50, reward: 300000 },
    { count: 100, reward: 500000 },
    { count: 500, reward: 2000000 },
  ];

  for (const milestone of milestones) {
    if (user.friendsReferred === milestone.count) {
      await addPoints(userId, milestone.reward);
      await Bot.telegram.sendMessage(
        userId,
        `Congratulations! You have referred ${
          milestone.count
        } friends and earned ${milestone.reward / 1000}k points!`
      );
    }
  }
};

export const addPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.points += points;
    await updateRank(user);
    await user.save();
  }
};

export const addReferalPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.referalPoints += points;
    await updateRank(user);
    await user.save();
  }
};

export const addSocialPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.socialPoints += points;
    await updateRank(user);
    await user.save();
  }
};

export const updateFriendsRefered = async (userId: string) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.friendsReferred += 1;
    await user.save();
  }
};

export const addReferal = async (userId: string, referredBy: string) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.referredBy = referredBy;
    await user.save();
  }
};

export const updateRank = async (user: User) => {
  for (let i = rankThresholds.length - 1; i >= 0; i--) {
    if (user.points >= rankThresholds[i].points) {
      user.league = rankThresholds[i].name.toLocaleUpperCase();
      break;
    }
  }
};

export const updateLastInteraction = async (userId: string) => {
  await userRepository.update(
    { telegramUserId: userId },
    { lastInteraction: new Date() }
  );
};

// Set up a scheduled task to check for inactive users
export const remindInactiveUsers = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const inactiveUsers = await userRepository.find({
    where: { lastInteraction: MoreThan(twentyFourHoursAgo) },
  });

  for (const user of inactiveUsers) {
    try {
      await Bot.telegram.sendMessage(
        user.telegramUserId,
        "You have not interacted with the bot for over 24 hours. Please come back and check your points!"
      );
      user.lastInteraction = new Date();
      await userRepository.save(user);
    } catch (error) {
      console.error(
        `Failed to send message to user @${user.telegramUserName}:`,
        error
      );
    }
  }
};
