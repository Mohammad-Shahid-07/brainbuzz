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

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});
export const ForgotPasswordSchema = z.object({
  password: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
});

export const AddUsernameSchema = z.object({
  username: z.string().min(2, {
    message: "Please enter a valid username.",
  }),
});
export const SetPasswordSchema = z.object({
  oldPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32)
    .optional()
    .or(z.literal("")),
  newPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
  confirmNewPassword: z
    .string()
    .min(6, {
      message: "Please use at least 6 characters.",
    })
    .max(32),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
  password: z.string().min(1, {
    message: "Please provide a password",
  }),
  code: z.optional(
    z.string().min(6, {
      message: "Please provide a code",
    }),
  ),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
  username: z.string().min(1, {
    message: "Please provide a username",
  }),
  password: z.string().min(6, {
    message: "Please provide a password with at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Please provide a name",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Please provide a password with at least 6 characters",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );
