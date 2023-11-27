"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = new Answer({
      content,
      author,
      question,
    });
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    await newAnswer.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw new Error("Error creating answer");
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const {questionId, sortBy, page =1 , pageSize=1} = params;
    let sortOptions = {};
    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = {upvotes: -1};
        break;
      case "lowestUpvotes":
        sortOptions = {upvotes: 1};
        break;
      case "recent":
        sortOptions = {createdAt: -1};
        break;
        case "old":
          sortOptions = {createdAt: 1};
          break;  
      default:
      
        break;
    }
    const skipAmount = (page - 1) * pageSize;
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture username")
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skipAmount + answers.length;  
    return {answers, isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;
   

    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    
    if (!answer) {
      throw new Error("Answer not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();
    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
  

    if (!answer) {
      throw new Error("Answer not found");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    const { answerId, path } = params;

    
    await Answer.deleteOne({_id:answerId});

    await Question.updateMany(
      { _id: answerId },
      { $pull: { answers: answerId } },
    );
    await Interaction.deleteMany({ answer: answerId });
   
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
