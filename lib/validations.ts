import * as z from "zod";
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).optional().or(z.literal("")),
  explanation: z.string().min(50),
  tags: z.array(z.string()).min(1).max(3),
  image: z
    .string()
    .min(4, "Please enter a valid value")
    .optional()
    .or(z.literal("")),
});

export const AnswerSchema = z.object({
  answer: z.string().min(50),
});

export const ProfileSchema = z.object({
  name: z.string().min(5).max(100),
  username: z.string().min(5).max(50),
  bio: z.string().min(5),
  location: z.string().min(5).max(100),
  portfolioWebsite: z.string().url().min(5),
  linkedin: z.string().url().min(5),
});

export const UserSchema = z.object({
  name: z.string().min(2, {
    message: "Please enter a valid name.",
  }),
  username: z.string().min(2, {
    message: "Please enter a valid username.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
});
