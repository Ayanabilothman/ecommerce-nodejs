import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";
import { Product } from "./product.model.js";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        _id: false,
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        name: String,
        quantity: {
          type: Number,
          min: 1,
        },
        itemPrice: Number,
        totalPrice: Number,
      },
    ],
    invoice: String,
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Shipped", "Delivered", "Canceled", "Refunded"],
    },
    payment: {
      type: String,
      default: "Cash",
      enum: ["Cash", "Visa"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// price after coupon dicsount
orderSchema.virtual("finalPrice").get(function () {
  if (this.coupon)
    return Number.parseFloat(
      this.price - (this.price * this.coupon.discount) / 100
    ).toFixed(2);
  return this.price;
});

// update products stock before deleting the order
orderSchema.pre("remove", async function () {
  for (const product of this.products) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        availableItems: Number(product.quantity),
        soldItems: -Number(product.quantity),
      },
    });
  }
});

export const Order = mongoose.models.Order || model("Order", orderSchema);
