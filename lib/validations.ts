import * as z from "zod";
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(100),
  explanation: z.string().min(50),
  tags: z.array(z.string()).min(1).max(3),
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