import { any, number, object, string, TypeOf, z } from "zod";

export const createTaskInput = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    point: number({
      required_error: "Required",
    }),
    activities: any({
      required_error: "Required",
    }).array(),

    type: string({
      required_error: "Required",
    }),
  }),
});

export type CreateTaskInput = Omit<TypeOf<typeof createTaskInput>["body"], "">;
