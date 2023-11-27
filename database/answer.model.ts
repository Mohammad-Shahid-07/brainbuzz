import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
  author: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const AnswerSchema = new Schema({
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  author: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true  },
  createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model("Answer", AnswerSchema);

export default Answer;
