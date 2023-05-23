import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    profileImage: {
      url: { type: String },
      id: { type: String },
    },
    coverImages: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      default: "offline",
      enum: ["offline", "online"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    activationCode: String,
    forgetCode: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

userSchema.methods.checkPassword = function (Password) {
  return bcrypt.compareSync(Password, this.password) ? true : false;
};

export const User = mongoose.models.User || model("User", userSchema);
