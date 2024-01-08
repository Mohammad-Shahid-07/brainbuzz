"use server";

import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetSchema,
} from "@/lib/validations";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../mongoose";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";

import crypto from "crypto";

import TwoFactorToken, {
  TwoFactorConfimation,
} from "@/database/verification_tokens/two_factor_token.model";
import EmailVerification from "@/database/verification_tokens/email_verify.model";
import ForgotPassword from "@/database/verification_tokens/forgot_pass.model";
import { sendEmail } from "../mailer";
import User from "@/database/user.model";
import { getRandomProfileUrl } from "@/constants";
import { processEmailForUsername } from "../utils";

const DEFAULT_LOGIN_REDIRECT = "/";
export async function LoginUser(values: z.infer<typeof LoginSchema>) {
  try {
    connectToDatabase();

    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email and password" };
    }
    const { email, password, code,  } = validatedFields.data;
    const callbackUrl = "/";
    const existingUser = await User.findOne({ email });

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: "User not found" };
    }
    if (!existingUser.emailVerified) {
      const verificationToken = await geterateVerificationToken(email);
      const token: string = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}`;

      await sendEmail(verificationToken.email, token, "Verify Email");

      return { success: "Confimation email sent" };
    }
    
    if (existingUser.twoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await TwoFactorToken.findOne({ token: code });

        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: "Invalid code" };
        }
        if (twoFactorToken.expiresAt.getTime() < new Date().getTime()) {
          return { error: "Code expired" };
        }

        await twoFactorToken.deleteOne();
        const existingConfimation = await TwoFactorConfimation.findOne({
          _id: existingUser._id,
        });

        if (existingConfimation) {
          await existingConfimation.deleteOne();
        }
        await TwoFactorConfimation.create({
          user: existingUser._id,
          expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000),
        });
      } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendEmail(
          existingUser.email,
          twoFactorToken.token,
          "Two Factor Code",
        );

        return { twoFactor: true };
      }
    }
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}

export async function LoginWithOAuth({ user, account }: any) {
  try {
    connectToDatabase();
    const { email, name, image } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      await User.updateOne(
        { "accounts.providerAccountId": account.providerAccountId },
        {
          $set: {
            "accounts.$": {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          },
        },
      );
      return true;
    } else {
      const username = processEmailForUsername(user.email);
      const newUser = new User({
        name,
        email,
        image,
        username,
        emailVerified: Date.now(),
        accounts: [
          {
            provider: account.provider,
            providerAccountId: account.id,
            access_token: account.accessToken,
            expires_at: account.expires,
            token_type: account.tokenType,
            scope: account.scope,
            id_token: account.idToken,
            providerId: account.id,
          },
        ],
      });
      await newUser.save();
    }

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "OAuthSignInError":
          return { error: "Please Try Again" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}

export async function RegisterUser(values: z.infer<typeof RegisterSchema>) {
  try {
    await connectToDatabase();

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Please provide a valid email and password" };
    }
    const { name, email, password, username } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const image = getRandomProfileUrl();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const newUser = new User({
      name,
      email,
      username,
      image,
      password: hashedPassword,
    });
    try {
      await newUser.save();
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }

    const verificationToken = await geterateVerificationToken(email);

    const token: string = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken.token}`;
    await sendEmail(email, token, "Verify Email");
    return { success: "Verification Email Sent!" };
  } catch (error: any) {
    return error.message;
  }
}

export async function GetUserByEmail(email: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function GetUserById(id: string) {
  try {
    connectToDatabase();

    const user = await User.findOne({ _id: id });
    if (!user) {
      return { error: "User not found" };
    }
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    connectToDatabase();
    const verificationToken = await EmailVerification.findOne({ email });
    if (!verificationToken) {
      return { error: "Token not found" };
    }
    return verificationToken;
  } catch (error) {
    console.log(error);
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    connectToDatabase();
    const verificationToken = await EmailVerification.findOne({ token });
    if (!verificationToken) {
      return { error: "Token not found" };
    }
    return verificationToken;
  } catch (error) {
    console.log(error);
  }
}

export const geterateVerificationToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
    await EmailVerification.findOneAndDelete({ email });

    const newVerificationToken = new EmailVerification({
      email,
      token,
      expiresAt,
    });
    await newVerificationToken.save();
    return newVerificationToken;
  } catch (error) {
    console.log(error);
  }
};

export async function verifyToken(token: string) {
  try {
    connectToDatabase();
    const existingToken = await EmailVerification.findOne({ token });

    if (!existingToken) {
      return { error: "Token not found" };
    }
    const hasExpired = new Date().getTime() > existingToken.expiresAt.getTime();
    if (hasExpired) {
      await existingToken.deleteOne();
      return { error: "Token expired" };
    }
    const { email } = existingToken;
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }

    user.emailVerified = new Date();
    user.email = email;
    await user.save();
    await existingToken.deleteOne();
    return { success: "Email Verified!" };
  } catch (error) {
    console.log(error);
  }
}

export const generatePasswordResetToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = uuidv4();
    const expiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);
    await ForgotPassword.findOneAndDelete({ email });

    const newPasswordResetToken = new ForgotPassword({
      email,
      token,
      expiresAt,
    });
    await newPasswordResetToken.save();
    return newPasswordResetToken;
  } catch (error) {
    console.log(error);
  }
};
export async function resetPassword(values: z.infer<typeof ResetSchema>) {
  try {
    const validatedFields = ResetSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email" };
    }
    const { email } = validatedFields.data;
    connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User not found" };
    }
    const verificationToken = await generatePasswordResetToken(email);
    const token = `${process.env.NEXTAUTH_URL}/new-password?token=${verificationToken.token}`;
    await sendEmail(verificationToken.email, token, "Reset Password");

    return { success: "Password reset email sent" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function resetPasswordWithToken(
  values: z.infer<typeof NewPasswordSchema>,
  token: string,
) {
  try {
    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Please provide a valid email" };
    }
    const { password } = validatedFields.data;
    connectToDatabase();

    const existingToken = await ForgotPassword.findOne({ token });
    if (!existingToken) {
      return { error: "Token not found" };
    }
    const user = await User.findOne({ email: existingToken.email });
    const hasExpired = new Date().getTime() > existingToken.expiresAt.getTime();
    if (hasExpired) {
      await existingToken.deleteOne();
      return { error: "Token expired" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    await existingToken.deleteOne();
    return { success: "Password reset" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

// export const getTwoFactorConfimationByUserId = async (userId: string) => {
//   try {
//     connectToDatabase();
//     const existingToken = await TwoFactorToken.findOne({ user: userId });
//     if (!existingToken) {
//       return { error: "Token not found" };
//     }
//     return existingToken;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const generateTwoFactorToken = async (email: string) => {
  try {
    connectToDatabase();
    const token = crypto.randomInt(100_100, 999_999).toString();
    const expiresAt = new Date(new Date().getTime() + 15 * 60 * 1000);
    await TwoFactorToken.findOneAndDelete({ email });

    const newTwoFactorToken = new TwoFactorToken({
      email,
      token,
      expiresAt,
    });
    await newTwoFactorToken.save();
    return newTwoFactorToken;
  } catch (error) {
    console.log(error);
  }
};

export async function getTwoFactorConfimationByUserId(userId: string) {
  try {
    const twoFactorConfimation = await TwoFactorConfimation.findOne({
      user: userId,
    });
    if (!twoFactorConfimation) {
      return { error: "Token not found" };
    }
    return twoFactorConfimation;
  } catch (error) {
    console.log(error);
  }
}
