"use server";

import Chat from "@/database/chat.model";
import { connectToDatabase } from "../mongoose";
import { GetChatParams, UpdateChatParams } from "./shared.types";

export async function getChat({ userId }: GetChatParams) {
  try {
    connectToDatabase();

    const chat = await Chat.findOne({ userId });
    if (!chat) {
      return [];
    }
    return chat.chatHistory;
  } catch (error) {
    console.log(error);
  }
}
export async function createUpdateChats({
  userId,
  chatHistory,
}: UpdateChatParams) {
  try {
    connectToDatabase();

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = await Chat.create({
        userId,
        chatHistory,
        createdAt: Date.now(),
      });
      return;
    }

    chat.chatHistory = chatHistory;
    await chat.save();

    return chat;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteChat(params: GetChatParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = JSON.parse(userId);
    await Chat.findOneAndUpdate({ user }, { chatHistory: [] });
  } catch (err) {
    console.log(err);
  }
}
