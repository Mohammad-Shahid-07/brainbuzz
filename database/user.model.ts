import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  bio?: string;
  location?: string;
  portfolioWebsite?: string;
  linkedin?: string;
  reputation: number;
  emailVerified: Date;
  image?: string;
  password?: string;
  updatedAt: Date;
  accounts: {
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
  }[];

  saved: Schema.Types.ObjectId[];
  savedBlogs: Schema.Types.ObjectId[];
  joinedAt: Date;
  twoFactorEnabled: boolean;
}
const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true },
  bio: String,
  location: String,
  portfolioWebsite: String,
  linkedin: String,
  reputation: { type: Number, default: 0 },
  emailVerified: { type: Date, default: null },
  image: String,
  password: String,
  updatedAt: { type: Date, default: null, index: true },
  accounts: [
    {
      provider: String,
      providerAccountId: String,
      refresh_token: String,
      access_token: String,
      expires_at: Number,
      token_type: String,
      scope: String,
      id_token: String,
    },
  ],
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  savedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  joinedAt: { type: Date, default: Date.now },
  twoFactorEnabled: { type: Boolean, default: false },
});
const User = models.User || model<IUser>("User", UserSchema);

export default User;
