import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const addProduct = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: generalFields.id,
    subcategory: generalFields.id,
    brand: generalFields.id,
  })
  .required();

export const updateProduct = joi
  .object({
    name: joi.string().min(2).max(20),
    description: joi.string(),
    availableItems: joi.number().min(1),
    price: joi.number().min(1),
    discount: joi.number().min(1).max(100),
    category: generalFields.id,
    subcategory: generalFields.id,
    brand: generalFields.id,
  })
  .required();
