import { LessThan, MoreThan } from "typeorm";
import { User } from "../entities/user.entity";
import { inviteMilestones, rankThresholds } from "../lib/constant";
import { AppDataSource } from "../lib/data-source";
import { Bot } from "../lib/telegram";
import moment from "moment";
import { User_Referal } from "../entities/user_referral.entity";
import { Special_Task } from "../entities/special_task.entity";
import { User_activity } from "../entities/user_activity.entity";
import { League_Task } from "../entities/league_task.entity";
import { User_task } from "../entities/user_task.entity";
import {
  findAllLeagueTask,
  findAllRefTask,
  findAllSpecialTask,
  findAllUserActivity,
  findAllUserTask,
} from "./task.services";

const userRepository = AppDataSource.getRepository(User);
const referalRepository = AppDataSource.getRepository(User_Referal);

export const createUser = async (input: Partial<User>) => {
  return await userRepository.save(userRepository.create(input));
};

export const creatReferral = async (input: Partial<User_Referal>) => {
  console.log(input, "cre");
  return await referalRepository.save(referalRepository.create({ ...input }));
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

export const findUserReferers = async (id: string) => {
  return await referalRepository.find({ where: { referredFromId: id } });
};

export const findAllUsers = async () => {
  return await userRepository.find();
};

export const checkMilestoneRewards = async (userId: string) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });

  if (!user) return;

  for (const milestone of inviteMilestones) {
    if (user.friendsReferred === milestone.count) {
      // await addPoints(userId, milestone.reward);
      // await updateRank(user);
      await Bot.telegram.sendMessage(
        userId,
        `You have referred ${milestone.count} friends and earned ${milestone.reward} points claim now!`
      );
    }
  }
};

export const addPoints = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.totalPoint += points;
    await updateRank(user);
    await user.save();
  }
};

export const addTouches = async (userId: string, points: number) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  if (user) {
    user.points += points;
    user.touches += points;
    user.totalPoint += points;
    await updateRank(user);
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
    user.totalPoint += points;
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
    user.totalPoint += points;
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

export const addReferal = async (
  userId: string,
  referredBy: string,
  point: number
) => {
  const user = await userRepository.findOne({
    where: { telegramUserId: userId },
  });
  const referrer = await userRepository.findOne({
    where: { telegramUserId: referredBy },
  });

  if (!user || !referrer) return;
  user.referredBy = referredBy;
  referrer.totalPoint += point;

  await creatReferral({
    referredFromId: referredBy,
    referredToId: userId,
    point,
  });
  await user.save();
  await referrer.save();
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

export const updateUser = async (userId: string, data: Partial<User>) => {
  await userRepository.update({ telegramUserId: userId }, data);
};

export const areAllSpecialActivitiesDone = async (
  user: User
): Promise<boolean> => {
  const tasks = await findAllSpecialTask();
  const userActivities = await findAllUserActivity();
  for (const task of tasks) {
    for (const activity of task.activities) {
      const userActivity = userActivities.find(
        (ua) =>
          ua.activityId === activity.id &&
          ua.taskId === task.id &&
          ua.userId === user.telegramUserId
      );

      if (!userActivity || !userActivity.clicked) {
        return false;
      }
    }
  }

  return true;
};

export const areAllLeagueTasksDone = async (user: User): Promise<boolean> => {
  return rankThresholds.some((milestone) => user.points === milestone.points);
};

export const areAllRefTasksDone = async (user: User): Promise<boolean> => {
  return inviteMilestones.some((milestone) => user.points === milestone.count);
};

// Set up a scheduled task to check for inactive users
export const incrementUserPoints = async () => {
  const allUsers = await userRepository.find();

  allUsers.forEach(async (user) => {
    if (user.limit < user.max) {
      user.limit += user.refillSpeed;
      await user.save();
    }
  });
};

// Set up a scheduled task to check for inactive users
export const incrementAutobot = async () => {
  const allUsers = await userRepository.find();
  const web_link = `${process.env.ORIGIN}/mobile/tap`;

  allUsers
    .filter((user) => user.autobot === true)
    .forEach(async (user) => {
      user.autoBotpoints += user.perclick;
      await user.save();

      if (user.autoBotpoints >= 40000) {
        await Bot.telegram.sendMessage(
          user.telegramUserId,
          `You have ${user.autoBotpoints}, empty your bot now to keep him tapping.`,
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: "Play now!", web_app: { url: web_link } }],
              ],
            },
          }
        );
      }
    });
};

// Set up a scheduled task to check for inactive users
export const resetUsersData = async () => {
  const allUsers = await userRepository.find();

  allUsers.forEach(async (user) => {

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
      await user.save();
    
  });
};

// Set up a scheduled task to check for inactive users
export const remindInactiveUsers = async () => {
  const users = await userRepository.find();
  const web_link = `${process.env.ORIGIN}/mobile/tap`;
  const now = moment();

  users.forEach(async (user) => {
    const lastInteraction = moment(user.lastInteraction);
    const duration = moment.duration(now.diff(lastInteraction));
    const hours = duration.asHours();

    if (hours > 48) {
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
      user.lastInteraction = new Date();
      await user.save();
    }
  });
};
