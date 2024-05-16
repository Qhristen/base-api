import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes";
import { AppDataSource } from "./lib/data-source";
import { Bot } from "./lib/telegram";
import AppError from "./lib/appError";

require("dotenv").config();

const web_link = `${process.env.ORIGIN}/welcome`;
const photoUrl = `${process.env.ORIGIN}/logo.png`;

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const bot = Bot;

    app.set("trust proxy", 1);

    //bot
    bot.start((ctx) => {
      const username = ctx.message!.from!.username;
      const welcomeMessage = `
    Hey, @${username}! Welcome to Base! Tap on the coin and see your balance rise.\n\nBase is a Decentralized Exchange on the Solana Blockchain. The biggest part of Base Token TAPS distribution will occur among the players here.\n\nGot friends, relatives, co-workers?\nBring them all into the game.\nMore buddies, more coins.
      `;

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

      ctx.reply(
        `@${username} profile\n\nNovice\nTotal score: 0\n\n/profile for personal stats`,
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
    });

    bot.command("invite", async (ctx) => {
      ctx.reply(`Share with your friends and earn bonuses for each friend you invite and for their activity:\n\nYour referral link: pending`);
    });

    bot.command("socials", async (ctx) => {
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

    // bot.on(message("web_app_data"), async (ctx) => {
    //   const text = ctx.webAppData?.data;
    //   ctx.reply(`data from web app ${text}`);
    //   console.log(text, "text");
    // });

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

    const port = process.env.PORT;

    app.listen(port);
    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
