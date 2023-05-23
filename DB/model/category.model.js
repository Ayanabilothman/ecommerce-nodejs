import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";
import { Subcategory } from "./subcategory.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 50 },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// virtuals
categorySchema.virtual("slug").get(function () {
  return slugify(this.name, "-");
});

categorySchema.virtual("subcategory", {
  localField: "_id",
  foreignField: "categoryId",
  ref: "Subcategory",
});

categorySchema.pre("remove", async function () {
  // document >>> remove
  await Subcategory.deleteMany({ categoryId: this._id });
});

export const Category =
  mongoose.models.Category || model("Category", categorySchema);

// statics
// categorySchema.statics.isExisted = async function (categoryID) {
//   return !(await this.findById(categoryID)) ? true : false;
// };
