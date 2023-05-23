import { asyncHandler } from "../utils/errorHandling.js";
import { ResError } from "../utils/errorClass.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const isAuthorized = (accessRoles = []) =>
  asyncHandler(async (req, res, next) => {
    //Check user authorization
    if (!accessRoles.includes(req.user.role))
      return next(new ResError("You are not authorized!", 403));
    return next();
  });
