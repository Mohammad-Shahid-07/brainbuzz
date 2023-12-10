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
  hashedPassword?: string;
  createdAt: Date;
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

  emailVerificationTokenExpiry?: Date;
  emailVerificationToken?: string;
  isVerified: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  saved: Schema.Types.ObjectId[];
  savedBlogs: Schema.Types.ObjectId[];
  joinedAt: Date;
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

  emailVerified: Date,
  image: String,
  hashedPassword: String,

  updatedAt: { type: Date, default: Date.now, index: true },

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

  emailVerificationTokenExpiry: Date,

  emailVerificationToken: String,

  isVerified: { type: Boolean, default: false },

  passwordResetToken: String,
  passwordResetTokenExpiry: Date,

  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  savedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
  joinedAt: { type: Date, default: Date.now },
});
const User = models.User || model<IUser>("User", UserSchema);

export default User;
