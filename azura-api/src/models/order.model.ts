import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const OrderItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: { type: String, default: "pending" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
