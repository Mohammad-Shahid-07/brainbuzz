import  {Schema, model, models, Document} from "mongoose";

export interface ITag extends Document {
    name: string;
    description: string;
    questionss: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdOn: Date;
}

const TagSchema = new Schema({
  name: { type: String, required: true , unique: true},
  description: { type: String, required: true },
  questionss: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // Change 'Question' to the actual model name
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Change 'User' to the actual model name
  createdOn: { type: Date, default: Date.now },
});

const Tags = models.Tags || model<ITag>("Tags", TagSchema);

export default Tags;