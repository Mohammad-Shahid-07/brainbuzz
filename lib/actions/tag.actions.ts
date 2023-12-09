"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tags from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return [
      { _id: "1", name: "test" },
      { _id: "2", name: "test2" },
      { _id: "3", name: "test3" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
   
    const { searchQuery, filter, page=1 , pageSize=20 } = params;

    const query: FilterQuery<typeof Tags> ={}
    if (searchQuery) {
     query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = {questions: -1};
        break;
      case "old":
        sortOptions = {createdAt: 1};
        break;
      case "recent":
        sortOptions = {createdAt: -1};
        break;
      case "name":
        sortOptions = {name: 1} ;
        break;
      default:
        break;
    }
    const skipAmount = (page - 1) * pageSize;

    const tags = await Tags.find(query)
    .limit(pageSize+1)
    .skip(skipAmount)
    .sort(sortOptions);
    const isNext = tags.length > pageSize;
    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionByTagName(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();
    const { tagName, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    const tag = await Tags.findOne({ name: tagName }).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        skip: skipAmount,
        limit: pageSize +1 ,
        sort: { createdAt: -1 },
      },

      populate: [
        {
          path: "author",
          model: User,
          select: "name username image _id",
        },
        { path: "tags", model: Tags, select: "name" },
      ],
    });

    if (!tag) {
      throw new Error("User not found");
    }
    const isNext = tag.questions.length > pageSize;

    
    const questions = tag.questions;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotTags() {
  try {
    connectToDatabase();
    const hotTags = await Tags.aggregate([
      { $project: { name: 1, totalQuestions: { $size: "$questions" } } },
    ])
      .sort({ totalQuestions: -1 })
      .limit(5);
    return hotTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
