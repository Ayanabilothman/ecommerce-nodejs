import mongoose, { Schema, model, Types } from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./../../config/.env") });

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    agent: {
      // browser mobile postman etc......
      type: String,
    },
    expiredAt: {
      type: String,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.methods.isExpired = function () {
  if (Date.now().valueOf() > this.expiredAt) {
    this.isValid = false;
    return true;
  }
  return false;
};

tokenSchema.pre("save", function () {
  this.expiredAt = jwt.verify(this.token, process.env.TOKEN_KEY).exp;
});

export const Token = mongoose.models.Token || model("Token", tokenSchema);
