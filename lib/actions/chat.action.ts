"use server";

import Chat from "@/database/chat.model";
import { connectToDatabase } from "../mongoose";

export async function getChat({ userId }) {
  try {
    connectToDatabase();

    const chat = await Chat.findOne({ user: "656d4c249ffa2ee042e0f367" });
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
    let chat = await Chat.findOne({ user: "656d4c249ffa2ee042e0f367" });

    if (!chat) {
      chat = await Chat.create({
        user: "656d4c249ffa2ee042e0f367",
        chatHistory: [],
        createdAt: Date.now(),
      });
    }

    chat.chatHistory = chatHistory;
    await chat.save();

    return chat;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteChat() {
  try {
    connectToDatabase();
    await Chat.deleteMany({});
  } catch (err) {
    console.log(err);
  }
}
