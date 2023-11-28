"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tags from "@/database/tag.model";
import Answer from "@/database/answer.model";

const searchableTypes = ["question", "user", "tag", "answer"];
export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();
    const { query, type } = params;
    const regex = { $regex: query, $options: "i" };
    let results: any[] = [];
    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name username", type: "user" },
      { model: Tags, searchField: "name", type: "tag" },
      { model: Answer, searchField: "content", type: "answer" },
    ];

    const typeLower = type?.toLowerCase();
    
    if (!typeLower || !searchableTypes.includes(typeLower)) {
      // Search all types
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResult = await model.find({ [searchField]: regex }).limit(2);

        results.push(
          ...queryResult.map((item) => ({
            title:
              type === "answer"
                ? `Answers Containing the ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.username
                : type === "answer"
                ? item.question
                : item._id,
            slug: type === "question" ? item.slug : undefined,
          })),
        );
      }
    } else {
      // Search specific type
      const modelInfo = modelsAndTypes.find((item) => item.type === typeLower);
      if (!modelInfo) {
        throw new Error("Invalid type");
      }
      const queryResult = await modelInfo.model
        .find({ [modelInfo.searchField]: regex })
        .limit(8);

      results = queryResult.map((item) => ({
        title:
          type === "answer"
            ? `Answers Containing the ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? item.username
            : type === "answer"
            ? `${item.question}/${item._id}`
            : item._id,
        slug: type === "question" ? item.slug : undefined,
        tag: type === "tag" ? item.name : undefined,
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
