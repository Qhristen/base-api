import { object, string, TypeOf, z } from "zod";

export const createUserSchema = object({
  body: object({
    full_name: string({
      required_error: "Name is required",
    }),
    telegramUserId: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
    telegramUserName: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),

    referralLink: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),

    referredBy: string({
      required_error: "Email address is required",
    }).email("Invalid email address"),
  }),
});

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>["body"], "">;
