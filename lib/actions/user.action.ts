"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session, getServerSession } from "next-auth";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { redirect } from "next/navigation";
import {
  CreateUserParams,
  CreateUserWithCredentialsParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetUserByIdParams,
  GetUserStatsParams,
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


let userSession: Session | null ;
export async function initSession() {

  const userSession = await getServerSession(authOptions);
 
  return userSession;
}

export async function getUserById(redirectURL: boolean) {
  await initSession();

  if (!userSession && redirectURL) {
    redirect("/signin");
  }
  try {
    const id = userSession?.user?.id;
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
    initSession();
    if (!userSession) {
      throw new Error("No active session");
    }
    const { username, path } = params;
    // Check if the username is already taken
    const user = await User.findOne({ email: userSession?.user?.email });

    if (!user) {
      throw new Error("User not found");
    }
    const existingUserWithUsername = await User.findOne({ username });

    if (existingUserWithUsername) {
      throw new Error("Username is already taken");
    }

    // Update the user record in the database with the new username
    user.username = params.username;
    await user.save();

    // Add the new username to the userSession
    userSession.user.username = user.username;
    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
export async function addName(params: { name: string; path: string }) {
  try {
    initSession();
    if (!userSession) {
      throw new Error("No active session");
    }
    connectToDatabase();
    const { name, path } = params;
    // Check if the username is already taken
    const user = await User.findOne({ email: userSession?.user?.email });
    if (!user) {
      throw new Error("User not found");
    }
    // Update the user record in the database with the new username
    user.name = name;
    await user.save();

    // Add the new username to the userSession
    userSession.user.name = user.name;
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
    initSession();
    if (!userSession) {
      throw new Error("No active session");
    }
    const user = await User.findOne({ email: userSession?.user?.email });
    if (!user) {
      throw new Error("User not found");
    }
    user.image = image;
    await user.save();
    // userSession.user.image = image;
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
    user.hashedPassword = hashedPassword;
    await user.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function changePass(params: any) {
  const { userId, newPassword, oldPassword, path } = params;
  try {
    connectToDatabase();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
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
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    await Question.deleteMany({ author: user._id });

    // TODO: Delete all the questions and answers of the user

    const deletedUser = await User.findOneAndDelete({ clerkId });
    return deletedUser;
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
    const { username } = params;
    if (username === "4f64eaa44708eacdfb67703150ce5f05.jpg") return;
    connectToDatabase();

    const user = await User.findOne({ username });

    if (!user) {
      return;
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
