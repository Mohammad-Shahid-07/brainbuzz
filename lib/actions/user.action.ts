"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  ChangePassParams,
  CreateUserParams,
  CreateUserWithCredentialsParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  GetUserStatsParams,
  TwoFactorSystemParams,
  UpdateUserImageParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tags from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { BadgeCriteriaType } from "@/types";
import { assignBadge, processEmailForUsername } from "../utils";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendEmail } from "../mailer";
import { getRandomProfileUrl } from "@/constants";
import { currentUser } from "../session";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";

export async function getUserById() {
  const userSession = await currentUser();
  if (!userSession) {
    return null;
  }
  try {
    const id = userSession?.id;
    connectToDatabase();
    if (!id) {
      return null;
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const { name, username, email, password, path } = userData;

    const existing = await User.findOne({ email });
    if (existing) {
      return { message: "Email already exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Example usage:
    const image = getRandomProfileUrl();

    const user = new User({
      name,
      email,
      hashedPassword,
      username,
      image,
    });
    await user.save();
    sendverifyEmail(email);
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function sendverifyEmail(email: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const verificationToken = crypto.randomBytes(64).toString("hex");
    const emailVericationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const emailVerificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user.emailVerificationToken = emailVericationToken;
    user.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt;
    const resetUrl = `${process.env.NEXTAUTH_URL}/signup/verify/${verificationToken}`;

    sendEmail(email, resetUrl, "Email Verification");

    await user.save();
    return true;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
export async function sendPasswordResetEmail(email: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = passwordResetTokenExpiry;

    const resetUrl = `${process.env.NEXTAUTH_URL}/signin/forgot-password/${resetToken}`;
    await sendEmail(email, resetUrl, "Password Reset");

    await user.save();
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

export async function verifyResetPasswordToken(params: any) {
  try {
    connectToDatabase();
    const hashedToken = crypto
      .createHash("sha256")
      .update(params)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
export async function resetPassword(params: any) {
  try {
    connectToDatabase();
    const { password, token } = params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired password reset token");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.hashedPassword = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

export async function verifyToken(token: string) {
  let redirectUrl = "/";
  try {
    connectToDatabase();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return false;
    }
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    user.isVerified = true;
    await user.save();
    redirectUrl = `${process.env.NEXTAUTH_URL}/signin`;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
  return redirect(redirectUrl);
}

export async function createUserWithProvider(
  params: CreateUserWithCredentialsParams,
) {
  try {
    connectToDatabase();
    const { user, account } = params;
    // Check if the user already exists
    const existingUser = await User.findOne({
      "accounts.providerAccountId": account.providerAccountId,
    });
    if (existingUser) {
      // User exists, update the accounts array
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

      // Check if the user has a username
    } else {
      // User does not exist, create a new user

      const username = processEmailForUsername(user.email);
      const newUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
        username,
        accounts: [
          {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
          },
        ],
        isVerified: true,
      });
      await newUser.save();
    }
    return true;
  } catch (error) {
    console.log(error);
  }

  // Handle redirection outside the try-catch block
  // If you get here, it means there was an error or no redirection is needed
  // return redirect(redirectUrl);
}
export async function addUsername(params: { username: string; path: string }) {
  try {
    connectToDatabase();
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }
    const { username, path } = params;

    const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,20}$/;
    if (!regex.test(username)) {
      // Handle the error (e.g., display a message to the user)
      return {
        error:
          "Please use only letters, numbers, and underscores. It should start with a letter and be between 3 to 20 characters long.",
      };
    }
    // Check if the username is already taken
    const user = await User.findOne({ email: userSession?.email });

    if (!user) {
      return { error: "User not found" };
    }
    const existingUserWithUsername = await User.findOne({ username });

    if (existingUserWithUsername) {
      return { error: "Username is already taken" };
    }

    // Update the user record in the database with the new username
    user.username = params.username;
    await user.save();

    // Add the new username to the userSession
    userSession.username = user.username;
    revalidatePath(path);
    return { success: "Username added successfully" };
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
export async function addName(params: { name: string; path: string }) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }

    connectToDatabase();
    const { name, path } = params;
    // Check if the username is already taken
    const user = await User.findOne({ email: userSession?.email });
    if (!user) {
      throw new Error("User not found");
    }
    // Update the user record in the database with the new username
    user.name = name;
    await user.save();

    // Add the new username to the userSession
    userSession.name = user.name;
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { userId, updateData, path } = params;
    await User.findOneAndUpdate({ _id: userId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateUserImage(params: UpdateUserImageParams) {
  try {
    const { image, path } = params;
    connectToDatabase();
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }

    const user = await User.findOne({ email: userSession?.email });
    if (!user) {
      throw new Error("User not found");
    }
    user.image = image;
    await user.save();
    userSession.image = image;
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function setNewPass(params: any) {
  const { userId, newPassword, path } = params;

  try {
    connectToDatabase();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function changePass(params: ChangePassParams) {
  const { userId, newPassword, oldPassword, path } = params;
  try {
    connectToDatabase();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword!, user.hashedPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.hashedPassword = hashedPassword;
    await user.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const userSession = await currentUser();
    const { password } = params;
    const user = await User.findOne({ email: userSession?.email });
    if (!user) {
      return { error: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Password is incorrect" };
    }

    
    // TODO: Delete all the questions and answers of the user

    await User.findOneAndDelete({ email: user.email })
    await signOut()
    return { success: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 30, filter, searchQuery } = params;
    const query: FilterQuery<typeof User> = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    const skipAmount = (page - 1) * pageSize;

    let sortOption = {};
    switch (filter) {
      case "new_users":
        sortOption = { joinedAt: -1 };
        break;
      case "old_users":
        sortOption = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOption = { reputation: -1 };
        break;
      default:
        break;
    }
    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOption);
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ username: userId });

    if (!user) {
      throw new Error("User not found");
    }
    const totalQuestions = await Question.countDocuments({
      author: user._id,
    });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      {
        $match: { author: user._id },
      },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      {
        $match: { author: user._id },
      },
      { $project: { _id: 0, upvotes: { $size: "$upvotes" } } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [QuestionVeiws] = await Question.aggregate([
      {
        $match: { author: user._id },
      },
      { $group: { _id: null, totalviews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: QuestionVeiws?.totalviews || 0,
      },
    ];

    const badgeCounts = assignBadge({ criteria });
    return { user, totalAnswers, totalQuestions, badgeCounts };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ views: -1, upvotes: -1 })
      .populate({ path: "tags", model: Tags, select: "_id name" })
      .populate("author", "name image _id username");
    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, totalQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 20 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const skipAmount = (page - 1) * pageSize;
    const userAnswers = await Answer.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: -1 })
      .populate("question", "_id title slug")
      .populate("author", "name image username _id");
    const isNext = totalAnswers > skipAmount + userAnswers.length;
    return { userAnswers, totalAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function TwoFactorSystem(params: TwoFactorSystemParams) {
  try {
    connectToDatabase();
    const { path, isTwoFactorEnabled } = params;
    const userSession = await currentUser();
    console.log("function ran");

    if (!userSession) {
      return { error: "User session not found" };
    }

    const user = await User.findOne({ email: userSession.email });

    if (!user) {
      return { error: "User not found" };
    }
    if (user.password) {
      user.twoFactorEnabled = isTwoFactorEnabled;
      await user.save();
      revalidatePath(path);
    }

    return {
      success: `Two Factor Authentication is ${
        user.twoFactorEnabled ? "Enabled" : "Disabled"
      }`,
    };
  } catch (error) {
    console.error("Error in TwoFactorSystem:", error);
    throw error;
  }
}
