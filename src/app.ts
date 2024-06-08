import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./lib/data-source";
import { Bot } from "./lib/telegram";
import AppError from "./lib/appError";
import { User } from "./entities/user.entity";
import {
  addPoints,
  addReferal,
  addReferalPoints,
  checkMilestoneRewards,
  createUser,
  findOneReferer,
  findOneUser,
  incrementUserPoints,
  remindInactiveUsers,
  resetUsersData,
  updateFriendsRefered,
  updateLastInteraction,
} from "./services/user.services";
import {
  bot_userName,
  initialPoint,
  premiumUserReferalBonus,
} from "./lib/constant";
import { CronJob } from "cron";

require("dotenv").config();

const web_link = `${process.env.ORIGIN}/welcome`;
const photoUrl = `${process.env.ORIGIN}/logo.png`;

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const bot = Bot;

    app.set("trust proxy", 1);

    //bot
    bot.start(async (ctx) => {
      const username = ctx.message!.from!.username;
      const welcomeMessage = `
    Hey, @${username}! Welcome to Base! Tap on the coin and see your balance rise.\n\nBase is a Decentralized Exchange on the Solana Blockchain. The biggest part of Base Token TAPS distribution will occur among the players here.\n\nGot friends, relatives, co-workers?\nBring them all into the game.\nMore buddies, more coins.
      `;

      const referredBy = ctx.message.text.split(" ")[1];

      const userId = ctx.message!.from!.id;
      const isUserPremium = ctx.message!.from!.is_premium;
      const full_name = `${ctx.message.from.first_name}`;
      const referralLink = `https://t.me/${bot_userName}?start=${userId}`;

      let user = await findOneUser(String(userId));

      if (!user) {
        const newUser = await createUser({
          full_name,
          telegramUserId: String(userId),
          telegramUserName: username,
          referralLink,
          totalPoint: initialPoint,
          limit: 500,
          max: 500,
          multiTap: 2,
          refillSpeed: 1,
          tapGuru: {
            active: false,
            max: 3,
            min: 3,
          },
          fullEnergy: {
            active: false,
            max: 3,
            min: 3,
          },
        });

        await newUser.save();
      }

      await updateLastInteraction(String(userId));

      if (user && !user?.referredBy) {
        await addReferal(user.telegramUserId, referredBy);
        // await addPoints(user.telegramUserId, initialPoint);

        
        const referrer = await findOneUser(referredBy);

        if (referrer && referrer.telegramUserId !== String(userId)) {
          if (isUserPremium) {
            await addReferalPoints(
              referrer.telegramUserId,
              premiumUserReferalBonus
            );
          } else {
            const refBounus = initialPoint / 2;
            await addReferalPoints(referrer.telegramUserId, refBounus);
          }
          await updateFriendsRefered(referrer.telegramUserId);
          await checkMilestoneRewards(referredBy);
        }
      }

      ctx.replyWithPhoto(
        { url: photoUrl },
        {
          caption: welcomeMessage,
          reply_markup: {
            inline_keyboard: [
              [{ text: "Start now!", web_app: { url: web_link } }],
              [
                {
                  text: "Join community",
                  callback_data: "join",
                },
              ],
              [
                {
                  text: "Help",
                  callback_data: "help",
                },
              ],
            ],
          },
        }
      );
    });

    bot.action("join", (ctx) => ctx.reply("👍"));

    bot.command("help", async (ctx) => {
      const userId = ctx.message!.from!.id;
      await updateLastInteraction(String(userId));

      const message = `
      Tap to Earn: \nBase is an addictive clicker game where you accumulate Shares by tapping the screen.\n\nLeagues:\nClimb the ranks by earning more Shares and outperforming others in the leagues.\n\nBoosts:\nUnlock boosts and complete tasks to maximize your Shares earnings.\n\nFriends:\nInvite others and both of you will receive bonuses. Assist your friends in advancing to higher leagues for bigger Shares rewards.\n\nThe Purpose:\nCollect as many Shares as possible and exchange them for TAPS, Base Token on Solana Blockchain.\n\nType /help to access this guide.`;

      ctx.replyWithPhoto(
        { url: photoUrl },
        {
          caption: message,
          reply_markup: {
            inline_keyboard: [
              [{ text: "Start now!", web_app: { url: web_link } }],
            ],
          },
        }
      );
    });

    bot.command("profile", async (ctx) => {
      const username = ctx.message!.from!.username;
      const userId = ctx.message!.from!.id;
      let user = await findOneUser(String(userId));

      await updateLastInteraction(String(userId));

      if (!user) {
        ctx.reply(`No user found`);
      } else {
        const allPoints =
          user?.points + user?.socialPoints + user?.referalPoints;

        ctx.reply(
          `@${username} profile\n\n${user?.league}\nTotal score: ${user?.points}\nBalance: ${allPoints}\n\n/profile for personal stats`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Invit friends",
                    callback_data: "invite",
                  },
                ],

                [{ text: "Play now!", web_app: { url: web_link } }],
              ],
            },
          }
        );
      }
    });

    bot.command("invite", async (ctx) => {
      const userId = ctx.message!.from!.id;
      let user = await findOneUser(String(userId));
      await updateLastInteraction(String(userId));

      ctx.reply(
        `Share with your friends and earn bonuses for each friend you invite and for their activity:\n\nYour referral link: ${user?.referralLink}`
      );
    });

    bot.command("socials", async (ctx) => {
      const userId = ctx.message!.from!.id;
      await updateLastInteraction(String(userId));

      ctx.reply(
        `Join our socials so you do not miss any important news or updates.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Join Base community",
                  url: `${process.env.ORIGIN}`,
                },
              ],
              [
                {
                  text: "Base on X",
                  url: `${process.env.ORIGIN}`,
                },
              ],
              [
                {
                  text: "Base website",
                  url: `${process.env.ORIGIN}`,
                },
              ],
              [{ text: "Play now!", web_app: { url: web_link } }],
            ],
          },
        }
      );
    });

    // MIDDLEWARE

    // Body parser
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: false }));

    // Logger
    if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

    // Cookie Parser
    app.use(cookieParser());

    // Cors
    app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );

    // ROUTES
    app.use("/api", router);

    // HEALTH CHECKER
    app.get("/", async (req: Request, res: Response) => {
      res.status(200).json({
        status: "success",
        message: "Welcome to base, we are happy to see you",
      });
    });

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    bot.launch();

    // Enable graceful stop
    // process.once("SIGINT", () => bot.stop("SIGINT"));
    // process.once("SIGTERM", () => bot.stop("SIGTERM"));

    const inactiveUsers = new CronJob("0 12 * * *", remindInactiveUsers); // Run every 24 hour
    const resetUserInfo = new CronJob("0 12 * * *", resetUsersData); // Run every 24 hour
    const incrementUserPointJob = new CronJob(
      "* * * * * *",
      incrementUserPoints
    ); // Run every second

    const jobEvery12Hours = new CronJob("0 */12 * * *", () => {
      console.log("Running every 12 hours:", new Date());
    }); // Cron job that runs every 12 hours

    inactiveUsers.start();
    resetUserInfo.start();
    incrementUserPointJob.start();

    const port = process.env.PORT;

    app.listen(port);
    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
