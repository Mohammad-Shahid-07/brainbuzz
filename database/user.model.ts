import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  clerkId: string;
  email: string;
  password: string;
  bio?: string;
  picture?: string;
  location?: string;
  portfolioWebsite?: string;
  linkedin?: string;
  reputation: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
  questions: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  
}

const UserSchema = new Schema({
    
        username: { type: String, required: true, unique: true },
        clerkId: { type: String, required: true },
        email: { type: String, required: true,unique: true  },
        password: { type: String },
        bio: { type: String },
        picture: { type: String },
        location: { type: String },
        portfolioWebsite: { type: String },
        linkedin: { type: String },
        reputation: { type: Number, default: 0 },
        saved: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Change 'SomeOtherModel' to the actual model name
        joinedAt: { type: Date, default: Date.now },
       
      
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
