import { number, object, string, TypeOf, z } from "zod";

export const createBoostInput = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    limit: number({
      required_error: "Required",
    }),
    type: string({
      required_error: "Required",
    }),
  }),
});

export type CreateBoostInput = Omit<TypeOf<typeof createBoostInput>["body"], "">;
