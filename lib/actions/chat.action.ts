"use server";

import Chat from "@/database/chat.model";
import { connectToDatabase } from "../mongoose";

export async function getChat({ userId }) {
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
export async function createUpdateChats({ userId, chatHistory }) {
  try {
    connectToDatabase();

    let chat = await Chat.findOne({userId});
    
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

export async function deleteChat({ user }) {
  try {
    connectToDatabase();
    const userId = JSON.parse(user);
    await Chat.findOneAndUpdate({ user: userId }, { chatHistory: [] });
    console.log("chat deleted");
  } catch (err) {
    console.log(err);
  }
}
