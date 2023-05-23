import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

export const activateCode = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

export const signupSchema = joi
  .object({
    userName: joi.string().min(3).max(20).alphanum().required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword.valid(joi.ref("password")),
  })
  .required();

export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();

export const sendForgetCode = joi
  .object({
    email: generalFields.email,
  })
  .required();

export const resetPassword = joi
  .object({
    code: joi.string().length(5).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.password.valid(joi.ref("password")),
  })
  .required();
