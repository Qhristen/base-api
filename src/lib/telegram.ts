import { Telegraf } from "telegraf";

export const Bot = new Telegraf(`${process.env.TELEGRAM_TOKEN}`);

