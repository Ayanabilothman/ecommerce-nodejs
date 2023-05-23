import { Category } from "../../../../DB/model/category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ResError } from "../../../utils/errorClass.js";

//////////////////**Get all categories**//////////////////
export const getAllCategories = async (req, res, next) => {
  const category = await Category.find({}).populate([
    {
      path: "subcategory",
      select: "name image.url -categoryId",
    },
  ]);
  return res
    .status(200)
    .json({ success: true, message: "Done", results: { category } });
};

//////////////////**Add category**//////////////////
export const createCategory = async (req, res, next) => {
  // upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/Category`,
    }
  );

  // create category
  const category = await Category.create({
    createdBy: req.user.id,
    name: req.body.name,
    "image.url": secure_url,
    "image.id": public_id,
  });

  return res.status(201).json({
    success: true,
    message: "category created!",
    results: { category },
  });
};

//////////////////**Update category**/////////////////
export const updateCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new ResError("In-valid category id", 400));

  category.name = req.body.name ? req.body.name : category.name;

  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: category.image.id,
    });
    category.image.url = secure_url;
  }

  await category.save();

  return res.status(200).json({
    success: true,
    message: "category updated!",
    results: { category },
  });
};

//////////////////**Delete category**/////////////////
export const deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new ResError("Category not found!", 404));

  await category.remove();
  // delete subcategory

  return res.status(200).json({
    success: true,
    message: "category deleted!",
  });
};
