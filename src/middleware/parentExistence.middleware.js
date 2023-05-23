import { ResError } from "../utils/errorClass.js";
import { asyncHandler } from "../utils/errorHandling.js";

////// check parent existence middlware /////
export const parentExisted = (Model, keyName) =>
  asyncHandler(async (req, res, next) => {
    if (!(await Model.findById(req.params[keyName])))
      return next(new ResError("Parent id not found!", 404));
    return next();
  });
