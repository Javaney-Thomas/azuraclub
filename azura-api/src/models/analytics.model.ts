import mongoose, { Document, Schema } from "mongoose";

export interface IAnalytics extends Document {
  _id: mongoose.Types.ObjectId;
  event: string;
  userId?: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  metadata?: any;
  timestamp: Date;
}

const AnalyticsSchema: Schema = new Schema(
  {
    event: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
