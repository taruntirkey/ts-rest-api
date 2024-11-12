import { z } from "zod";

const createUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1).max(255),
    lastname: z.string().min(1).max(255),
    username: z.string().min(3).max(255),
    password: z
      .string()
      .min(12)
      .max(255)
      .refine(
        (val) =>
          /^.*(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).*$/.test(val),
        {
          message:
            "Password should contain at least one number, one uppercase letter and one special characters !@#$&*.",
        }
      ),
  }),
});

// Regex Explanation:
// /^.*(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).*$/
// ^.*                       Start.
// (?=.*[A-Z])               At least one uppercase letter.
// (?=.*[!@#$&*])            At least one special case letter.
// (?=.*[0-9].*[0-9])        At least one digit.
// (?=.*[a-z])               At least one lowercase letter.
// .*$                       End.

const authUserSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string(),
  }),
});

const updateUserSchema = z.object({
  body: z
    .object({
      firstname: z.string().min(1),
      lastname: z.string().min(1),
    })
    .partial()
    .refine(
      ({ firstname, lastname }) =>
        firstname !== undefined || lastname !== undefined,
      {
        message: "One of the fields must be defined",
      }
    ),
});

type CreateUser = z.infer<typeof createUserSchema.shape.body>;
type AuthUser = z.infer<typeof authUserSchema.shape.body>;
type UpdateUser = z.infer<typeof updateUserSchema.shape.body>;

export {
  createUserSchema,
  CreateUser,
  authUserSchema,
  AuthUser,
  updateUserSchema,
  UpdateUser,
};
