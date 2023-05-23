import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const createOrder = joi
  .object({
    address: joi.string().min(1).required(),
    phone: joi.number().required(),
    payment: joi.string().valid("Cash", "Visa"),
    coupon: joi.string(),
  })
  .required();

export const cancelOrder = joi
  .object({
    orderId: generalFields.id,
  })
  .required();

export const checkOut = joi
  .object({
    orderId: generalFields.id,
  })
  .required();

export const updateOrder = joi
  .object({
    name: joi.string().min(2),
    price: joi.number().min(1),
    stock: joi.number().min(1),
  })
  .required();
