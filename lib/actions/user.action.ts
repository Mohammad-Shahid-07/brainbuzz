"use server";

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
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tags from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import { BadgeCriteriaType } from "@/types";
import { assignBadge } from "../utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";
export async function getUserById(clerkId: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserByClerkId(clerkId: string) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId }).select("username _id");
    return user.username;
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
    const user = new User({
      name,
      email,
      hashedPassword,
      username,
    });
    await user.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUserWithProvider(
  params: CreateUserWithCredentialsParams,
) {
  let redirectUrl = "/";

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
      if (!existingUser.username) {
        // Do not redirect here
        // You can return a value indicating that redirection is needed
        redirectUrl = "/signup/username";
        return;
      }
    } else {
      // User does not exist, create a new user

      const newUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
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

      // Do not redirect here
      // You can return a value indicating that redirection is needed
      redirectUrl = "/signup/username";
      return;
    }
  } catch (error) {
    console.log(error);
  }

  // Handle redirection outside the try-catch block
  // If you get here, it means there was an error or no redirection is needed
  return redirect(redirectUrl);
}
export async function addUsername(params: any) {
  try {
    const session: any = await getServerSession(authOptions);
    connectToDatabase();

    // Check if the username is already taken
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      throw new Error("User not found");
    }
    const existingUserWithUsername = await User.findOne({
      username: params.username,
    });

    if (existingUserWithUsername) {
      throw new Error("Username is already taken");
    }

    // Update the user record in the database with the new username
    user.username = params.username;
    await user.save();

    // Add the new username to the session
    session.user.username = user.username;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to handle it in the calling code
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

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

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id",
    // );
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
    const { page = 1, pageSize = 10, filter, searchQuery } = params;
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
    const totalQuestions = await Question.countDocuments({ author: user._id });
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
      .populate("author", "name picture clerkId username");
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
      .populate("author", "name picture username clerkId");
    const isNext = totalAnswers > skipAmount + userAnswers.length;
    return { userAnswers, totalAnswers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
