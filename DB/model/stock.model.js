import mongoose, { Schema, model, Types } from "mongoose";

const stockSchema = new Schema(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
    },
    color: {
      type: String,
      enum: ["green", "blue", "red", "yellow", "black", "white", "brown"],
    },
    size: {
      type: String,
      enum: ["xs", "s", "m", "l", "xl", "xxl"],
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Stock = mongoose.models.Stock || model("Stock", productSchema);
