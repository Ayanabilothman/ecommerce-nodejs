import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";

const subcategorySchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 50 },
    image: { type: Object, required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

subcategorySchema.virtual("slug").get(function () {
  return slugify(this.name, "-");
});

export const Subcategory =
  mongoose.models.Subcategory || model("Subcategory", subcategorySchema);
