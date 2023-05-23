import joi from "joi";
import { Types } from "mongoose";
import { ResError } from "../utils/errorClass.js";

const validateObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("in-valid objectId");
};
export const generalFields = {
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 4,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: joi.string().required(),
  cPassword: joi.string().required(),
  id: joi.string().custom(validateObjectId).required(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),
};

export const validation = (joiSchema) => {
  return (req, res, next) => {
    const inputs = {
      ...req.body,
      ...req.query,
      ...req.params,
      ...((req.file || req.files) && { file: req.file || req.files }),
    };

    const { error } = joiSchema.validate(inputs, { abortEarly: false });

    if (error != null) {
      const messages = error.details.map((object) => object.message);
      return next(new ResError(messages, 400));
    }

    return next();
  };
};
