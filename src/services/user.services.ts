import { LessThan, MoreThan } from "typeorm";
import { User } from "../entities/user.entity";
import { rankThresholds } from "../lib/constant";
import { AppDataSource } from "../lib/data-source";
import { Bot } from "../lib/telegram";

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

export const findAllUsers = async () => {
  return await userRepository.find();
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
      await addPoints(userId, milestone.reward, 0);
      await Bot.telegram.sendMessage(
        userId,
        `Congratulations! You have referred ${
          milestone.count
        } friends and earned ${milestone.reward / 1000}k points!`
      );
    }
  }
};

export const addPoints = async (
  userId: string,
  points: number,
  touch: number
) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.points += points;
    user.touches += touch;
    user.totalPoint += points
    await updateRank(userId);
    await user.save();
  }
};

export const removePoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.totalPoint -= points;
    await user.save();
  }
};

export const addReferalPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.referalPoints += points;
    user.totalPoint += points
    await updateRank(userId);
    await user.save();
  }
};

export const addSocialPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.socialPoints += points;
    user.totalPoint += points
    await updateRank(userId);
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
export const baseStats = async () => {
  const totalUsers = await userRepository.count();
  const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const onlineUsers = await userRepository.count({
    where: { lastInteraction: LessThan(oneHourAgo) },
  });
  const dailyUsers = await userRepository.count({
    where: { lastInteraction: LessThan(twentyFourHoursAgo) },
  });

  const allUsers = await userRepository.find();
  const totalPoints = allUsers.reduce((sum, user) => sum + user.totalPoint, 0);

  const totalTouches = allUsers.reduce((sum, user) => sum + user.touches, 0);

  return {
    totalUsers,
    onlineUsers,
    dailyUsers,
    totalPoints,
    totalTouches,
  };
};

export const updateRank = async (id: string) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: id },
  });
  for (let i = rankThresholds.length - 1; i >= 0; i--) {
    if (user && user.points >= rankThresholds[i].points) {
      user.league = rankThresholds[i].name.toLocaleLowerCase();
      await user.save();
    }
  }
};

export const updateLastInteraction = async (userId: string) => {
  await userRepository.update(
    { telegramUserId: userId },
    { lastInteraction: new Date() }
  );
};

export const updateUser = async (userId: string, data: Partial<User>) => {
  await userRepository.update({ telegramUserId: userId }, data);
};

// Set up a scheduled task to check for inactive users
export const incrementUserPoints = async () => {
  const allUsers = await userRepository.find();

  allUsers.forEach(async (user) => {
    if (user.limit < user.max) {
      user.limit += user.refillSpeed;
    }
  });
};

// Set up a scheduled task to check for inactive users
export const resetUsersData = async () => {
  const allUsers = await userRepository.find();

  for (const user of allUsers) {
    try {
      user.tapGuru = {
        active: false,
        max: 3,
        min: 3,
      };
      user.fullEnergy = {
        active: false,
        max: 3,
        min: 3,
      };
      await userRepository.save(user);
    } catch (error) {
      console.error(`Failed to send message`, error);
    }
  }
};

// Set up a scheduled task to check for inactive users
export const remindInactiveUsers = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const inactiveUsers = await userRepository.find({
    where: { lastInteraction: MoreThan(twentyFourHoursAgo) },
  });
  const web_link = `${process.env.ORIGIN}/welcome`;

  for (const user of inactiveUsers) {
    try {
      await Bot.telegram.sendMessage(
        user.telegramUserId,
        "You have not interacted with the bot for over 24 hours. Please come back and check your points!",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Play now!", web_app: { url: web_link } }],
            ],
          },
        }
      );
      // user.lastInteraction = new Date();
      await userRepository.save(user);
    } catch (error) {
      console.error(
        `Failed to send message to user @${user.telegramUserName}:`,
        error
      );
    }
  }
};
