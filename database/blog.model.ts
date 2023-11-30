import { Schema, models, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  content: string;
  description: string;
  image: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  slug: string;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  createdAt: Date;
}

const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
  description: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true },
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
