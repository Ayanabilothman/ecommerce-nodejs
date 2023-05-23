import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, required: true },
    expiredAt: Number,
    discount: { type: Number, min: 1, max: 100, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

// delete the coupon document after 1 second from the expire date
//couponSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 1 });

export const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema);
