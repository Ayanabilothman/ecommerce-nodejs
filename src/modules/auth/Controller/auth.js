import { Token } from "../../../../DB/model/token.model.js";
import { User } from "../../../../DB/model/user.model.js";
import { sendEmail } from "../../../utils/email.js";
import { signUpTemp, resetPassTemp } from "./../../../utils/generateHTML.js";
import { ResError } from "./../../../utils/errorClass.js";
import { Cart } from "./../../../../DB/model/cart.model.js";
import crypto from "crypto";
import path from "path";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./../../../../config/.env") });

////////////////////////////////// Registeration //////////////////////////////////
export const register = async (req, res, next) => {
  // get data from request
  const { userName, email, password } = req.body;

  // check the user existence
  if (await User.findOne({ email }))
    return next(new ResError("Email already existed!", 409));

  // create confirmation code
  const activationCode = crypto.randomBytes(64).toString("hex");

  // create user
  const user = new User({
    userName,
    email,
    password,
    activationCode,
  });

  user.save((error) => {
    if (error) {
      return next(error);
    } else {
      // send email
      const link = `http://localhost:5000${process.env.BASE_URL}/auth/confirmEmail/${activationCode}`;
      return sendEmail({
        to: user.email,
        subject: "Activate Account",
        html: signUpTemp(link),
      })
        ? res.status(201).json({ success: true, message: "user created!" })
        : next(new ResError("Something went wrong!", 400));
    }
  });
};

////////////////////////////////// Activate Account //////////////////////////////////
export const activateAcc = async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    {
      activationCode: req.params.activationCode,
    },
    { isConfirmed: true, $unset: { activationCode: 1 } }
  );

  if (!user) return next(new ResError("Account not found!", 404));

  // create a cart
  await Cart.create({ user: user._id });

  return res.send(
    "Congratulations, your account is now activated, try to login!"
  );
};

////////////////////////////////// Login //////////////////////////////////
export const login = async (req, res, next) => {
  // get data from request
  const { email, password } = req.body;
  if (!(email && password)) return next(new ResError("Data is required!", 400));

  const user = await User.findOne({ email });
  // check user
  if (!user) return next(new ResError("Email is not found!", 404));

  // check activation
  if (!user.isConfirmed)
    return next(new ResError("Please activate your account!", 404));

  // check password
  const isMatch = user.checkPassword(password);
  if (!isMatch) return next(new ResError("Password is incorrect!", 400));

  // generate token
  const token = jwt.sign(
    { id: user._id, email: email, role: user.role },
    process.env.TOKEN_KEY,
    { expiresIn: "2 days" }
  );

  // save token
  new Token({
    token,
    user: user.id,
    agent: req.headers["user-agent"],
  }).save();

  user.status = "online";
  await user.save();
  return res.json({ success: true, results: { token } });
};

//////////////// Send forget password code ////////////////
export const sendForgetCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ResError("User not found!", 404));

  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  user.forgetCode = code;
  await user.save();

  return sendEmail({
    to: user.email,
    subject: "Reset password",
    html: resetPassTemp(code),
  })
    ? res.status(201).json({ success: true, message: "code sent!" })
    : next(new ResError("Something went wrong!", 400));
};

//////////////// Reset password ////////////////
export const resetPassword = async (req, res, next) => {
  const { code, email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return next(new ResError("User not found!", 404));

  if (user.forgetCode !== code) return next(new ResError("Invalid code!", 400));

  user = await User.findOneAndUpdate({ email }, { $unset: { forgetCode: 1 } });
  user.password = password;
  await user.save();

  // invalidate tokens
  const tokens = await Token.find({ createdBy: user._id });

  // we can delete all token for this user
  // or to save history we set is valid to false
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  return res.status(200).json({ success: true, message: "Done!" });
};
