import { User } from "../../DB/model/user.model.js";
import { Token } from "../../DB/model/token.model.js";
import { asyncHandler } from "../utils/errorHandling.js";
import { ResError } from "../utils/errorClass.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  // chech token existence and type
  let token = req.headers["authorization"]; // Bearer token
  if (!token || !token.startsWith(process.env.BEARER_KEY))
    return next(new ResError("Valid token is required!", 400));

  // check token
  token = token.split(process.env.BEARER_KEY)[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new ResError("Token is invalid!", 401));

  // check token in DB
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new ResError("Token expired!", 400));

  // check user existence
  const user = await User.findOne({ email: decoded.email });
  if (!user) return next(new ResError("User not found!", 400));

  req.user = { email: user.email, id: user._id, role: user.role };
  return next();
});
