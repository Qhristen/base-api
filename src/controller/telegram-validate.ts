import { NextFunction, Request, Response } from "express";
import { getCheckString } from "../utils/getCheckString";
import { HMAC_SHA256 } from "../utils/HMAC_SHA256";

export const telegramValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = new URLSearchParams(req.body);
  console.log(req.body, "webapp data")

  const data_check_string = getCheckString(data);
  const secret_key = HMAC_SHA256(
    "WebAppData",
    process.env.TELEGRAM_TOKEN!
  ).digest();
  const hash = HMAC_SHA256(secret_key, data_check_string).digest("hex");

  if (hash === data.get("hash"))
    // validated!
    return res.json(Object.fromEntries(data.entries()));

  return res.status(401).json({});
};
