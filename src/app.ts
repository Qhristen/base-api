import cookieParser from "cookie-parser";
import cors from "cors";
import { CronJob } from "cron";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import AppError from "./lib/appError";
import {
  bot_userName,
  premiumUserReferalBonus,
  referalPoint,
} from "./lib/constant";
import { AppDataSource } from "./lib/data-source";
import { Bot } from "./lib/telegram";
import router from "./routes";
import {
  addReferal,
  checkMilestoneRewards,
  createUser,
  findOneUser,
  incrementUserPoints,
  remindInactiveUsers,
  resetUsersData,
  updateFriendsRefered,
  updateLastInteraction,
} from "./services/user.services";

require("dotenv").config();

const web_link = `${process.env.ORIGIN}/welcome`;
const auth_web_link = `${process.env.ORIGIN}/mobile/tap`;
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
    Hey, @${username}! Welcome to Tap on Base(Eraswap)! Tap on the coin and see your balance rise.\n\nEraswap is a hybrid Mini Telegram. Tap to earn seamless and efficient DEX with Base.\n\nTrade + Earn + Launchpad on the leading on Base.\nGot friends, relatives, co-workers?\nBring them all into the game.\nMore buddies, more coins.
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
          totalPoint: 0,
          limit: 500,
          max: 500,
          multiTap: 2,
          multiTapPoint: 200,
          multiTapLevel: 1,
          refillSpeed: 1,
          refillLevel: 1,
          chargeLevel: 1,
          chargeLimitPoint: 200,
          refillPoint: 2000,
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

        const savedUser = await newUser.save();
        await updateLastInteraction(String(userId));

        if (Number(referredBy) && String(userId) !== referredBy) {
          await addReferal(
            savedUser.telegramUserId,
            referredBy,
            isUserPremium ? premiumUserReferalBonus : referalPoint
          );
          await updateFriendsRefered(referredBy);
          await checkMilestoneRewards(referredBy);
        }
      }

      ctx.replyWithPhoto(
        { url: photoUrl },
        {
          caption: welcomeMessage,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Start now!",
                  web_app: {
                    url: user?.welcomePage ? auth_web_link : web_link,
                  },
                },
              ],
              [
                {
                  text: "Join community",
                  url: "https://t.me/taponeraswap",
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
      let user = await findOneUser(String(userId));

      ctx.replyWithPhoto(
        { url: photoUrl },
        {
          caption: message,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Start now!",
                  web_app: {
                    url: user?.welcomePage ? auth_web_link : web_link,
                  },
                },
              ],
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
        ctx.reply(
          `@${username} profile\n\n${user?.league}\nTotal score: ${user?.points}\nBalance: ${user.totalPoint}\n\n/profile for personal stats`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Invit friends",
                    callback_data: "invite",
                  },
                ],

                [
                  {
                    text: "Play now!",
                    web_app: {
                      url: user?.welcomePage ? auth_web_link : web_link,
                    },
                  },
                ],
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
      let user = await findOneUser(String(userId));

      ctx.reply( 
        `Join our socials so you do not miss any important news or updates.`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Join Base community",
                  url: `https://t.me/taponeraswap`,
                },
              ],
              [
                {
                  text: "Base on X",
                  url: `https://x.com/eraswap_`,
                },
              ],
              [
                {
                  text: "Base website",
                  url: `http://www.eraswap.club/`,
                },
              ],
              [
                {
                  text: "Base Discord Channel",
                  url: `https://discord.gg/scfW5Xkc6w`,
                },
              ],
              [
                {
                  text: "Play now!",
                  web_app: {
                    url: user?.welcomePage ? auth_web_link : web_link,
                  },
                },
              ],
            ],
          },
        }
      );
    });

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


    // const inactiveUsers = new CronJob("0 0 * * * *", remindInactiveUsers); // Run every 12 hour
    const twentyFourhrJobs = new CronJob(
      "0 0 * * * *",
      async () => {
        await resetUsersData();
        await remindInactiveUsers();
      },
      null,
      true,
      "UTC"
    ); // Run every 24 hour
    const incrementUserPointJob = new CronJob(
      "*/2 * * * * *",
      incrementUserPoints
    ); // Run every second

    // inactiveUsers.start();
    twentyFourhrJobs.start();
    incrementUserPointJob.start();

    
    // Enable graceful stop
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    const port = process.env.PORT;

    app.listen(port);
    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
