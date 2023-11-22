import * as z from "zod";
export const QuestionsSchema = z.object({
  title: z.string().min(5).max(100),
  explanation: z.string().min(50),
  tags: z.array(z.string()).min(1).max(3),
});
