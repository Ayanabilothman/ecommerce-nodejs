import { Subcategory } from "../../../../DB/model/subcategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { ResError } from "../../../utils/errorClass.js";

//////////////////**Get all subcategories**//////////////////
export const getAllSubcategories = async (req, res, next) => {
  const subcategories = await Subcategory.find({}).populate([
    {
      path: "createdBy",
      select: "userName profileImage.url",
    },
    {
      path: "categoryId",
      select: "name image.url",
    },
  ]);

  return res
    .status(200)
    .json({ success: true, message: "Done", results: { subcategories } });
};

//////////////////**Add subcategory**//////////////////
export const createSubcategory = async (req, res, next) => {
  //upload image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/Subcategory` }
  );

  //create subcategory
  const subcategory = await Subcategory.create({
    createdBy: req.user.id,
    name: req.body.name,
    "image.url": secure_url,
    "image.id": public_id,
    categoryId: req.params.categoryId,
  });

  return res.status(201).json({
    success: true,
    message: "subcategory created!",
    results: { subcategory },
  });
};

//////////////////**Update subcategory**/////////////////
export const updateSubcategory = async (req, res, next) => {
  const subcategory = await Subcategory.findOne({
    _id: req.params.subcategoryId,
    categoryId: req.params.categoryId,
  });

  if (!subcategory)
    return next(new ResError("In-valid subcategory or category id!", 400));

  subcategory.name = req.body.name ? req.body.name : subcategory.name;

  if (req.file) {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id,
    });
    subcategory.image.url = secure_url;
  }

  await subcategory.save();

  return res.status(200).json({
    success: true,
    message: "subcategory updated!",
    results: { subcategory },
  });
};
