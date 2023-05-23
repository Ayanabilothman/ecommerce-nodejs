import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";
import { size, color } from "./product.model.js";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    products: [
      {
        _id: false,
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
