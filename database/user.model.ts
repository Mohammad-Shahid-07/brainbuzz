import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture?: string;
  location?: string;
  portfolioWebsite?: string;
  linkedin?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  savedBlogs: Schema.Types.ObjectId[];
  joinedAt: Date;
  owner?: boolean;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  bio: { type: String },
  picture: { type: String },
  location: { type: String },
  portfolioWebsite: { type: String },
  linkedin: { type: String },
  reputation: { type: Number, default: 0 },
  owner: { type: Boolean, default: false },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Change 'SomeOtherModel' to the actual model name
  savedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  joinedAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
