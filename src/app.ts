import { AppDataSource } from "./Utils/data-source";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import AppError from "./Utils/appError";
import router from "./routes";

require("dotenv").config();

const bot = new Telegraf(`${process.env.TELEGRAM_TOKEN}`);
const web_link = `${process.env.ORIGIN}/welcome`;

AppDataSource.initialize()
  .then(async () => {
  
    const app = express();

    app.set("trust proxy", 1);

    //bot
    bot.start((ctx) => {
      const username = ctx.message!.from!.username;
      const welcomeMessage = `
      Hey, @${username}! Welcome to Base! Tap on the coin and see your balance rise.\nBase is a Decentralized Exchange on the Solana Blockchain. The biggest part of Base Token TAPS distribution will occur among the players here.\nGot friends, relatives, co-workers?\nBring them all into the game.\nMore buddies, more coins.
      `;
      ctx.replyWithHTML(welcomeMessage);
    });

    bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))

    bot.command("help", async (ctx) => {
      ctx.reply(`Help is on the way`);
    });

    bot.command("profile", async (ctx) => {
      ctx.reply(`Profile is on the way`);
    });

    bot.command("invite", async (ctx) => {
      ctx.reply(`Invite is on the way`);
    });

    bot.command("socials", async (ctx) => {
      ctx.reply(
        `Socials is on the way`,

        {
          reply_markup: {
            inline_keyboard: [[{ text: "Play", web_app: { url: web_link } }]],
          },
        }
      );
    });

    bot.on(message('web_app_data'), async (ctx) => {
       const text = ctx.webAppData?.data;
       ctx.reply(`data from web app ${text}`);
       console.log(text, 'text')
    })

  
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
