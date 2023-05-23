import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createCoupon = joi
  .object({
    discount: joi.number().positive().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
  })
  .required();

export const updateCoupon = joi
  .object({
    name: joi.string().required(),
    discount: joi.number().positive().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
  })
  .required();
