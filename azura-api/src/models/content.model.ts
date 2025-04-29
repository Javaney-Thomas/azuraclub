import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export default mongoose.model<IContent>("Content", ContentSchema);
