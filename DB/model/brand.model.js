import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

brandSchema.virtual("slug").get(function () {
  return slugify(this.name, "-");
});

export const Brand = mongoose.models.Brand || model("Brand", brandSchema);
