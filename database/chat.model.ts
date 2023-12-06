import { Schema, models, model, Document } from "mongoose";

interface IMessage {
  role: string;
  content: string;
}

export interface IChat extends Document {
  userId: Schema.Types.ObjectId;
  chatHistory: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema({
  role: { type: String, required: true },
  content: { type: String, required: true },
});

const ChatSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  chatHistory: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
});

const Chat = models.Chat || model<IChat>("Chat", ChatSchema);

export default Chat;
