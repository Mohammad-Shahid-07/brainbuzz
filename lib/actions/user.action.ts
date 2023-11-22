"use server";


import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";

export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { id } = params;
    const user = await User.findOne({ clerkId: id });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
