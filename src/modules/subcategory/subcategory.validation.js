import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createSubcategory = joi
  .object({
    categoryId: generalFields.id,
    name: joi.string().min(3).max(50).required(),
    file: generalFields.file.required(),
  })
  .required();

export const updateSubcategory = joi
  .object({
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    name: joi.string().min(3).max(50),
    file: generalFields.file,
  })
  .required();
