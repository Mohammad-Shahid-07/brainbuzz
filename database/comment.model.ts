import { Schema, models, model, Document } from "mongoose";

export interface IComment extends Document {
  author: Schema.Types.ObjectId;
  blog: Schema.Types.ObjectId;
  content: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  reply: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  reply: { type: Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
