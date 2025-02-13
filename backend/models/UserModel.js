import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  MAX_SEARCH_HISTORY_ITEM_LENGTH,
  MAX_SEARCH_HISTORY_ITEMS,
} from "../utils/constant.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      uppercase: true,
      validate: (value) => {
        if (!validator.isAlpha(value))
          throw new Error("Please enter a valid firstName");
      },
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      uppercase: true,
      validate: (value) => {
        if (!validator.isAlpha(value))
          throw new Error("Please enter a valid firstName");
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxLength: 40,
      validate: (value) => {
        if (!validator.isEmail(value))
          throw new Error("Please enter a valid email");
      },
    },
    password: {
      type: String,
      required: true,
      // select: false, // this will prevent password to be selected
      validate: (value) => {
        if (!validator.isStrongPassword(value))
          throw new Error("Please enter a strong password");
      },
    },
    phone: {
      type: String,
      validate: (value) => {
        if (!validator.isMobilePhone(value, "any", { strictMode: true }))
          throw new Error(
            "Please enter a valid phone number with country code"
          );
      },
    },
    profilePicture: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value))
          throw new Error("Please enter a valid profile picture URL");
      },
    },
    linkedInUsername: {
      type: String,
      maxLength: 20,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    searchHistory: {
      type: [String],
      validate: (value) => {
        if (value.length > MAX_SEARCH_HISTORY_ITEMS)
          throw new Error(
            "search history can have atmost " +
              MAX_SEARCH_HISTORY_ITEMS +
              " items"
          );
        value.forEach((keyword) => {
          if (keyword.length > MAX_SEARCH_HISTORY_ITEM_LENGTH)
            throw new Error(
              "Each keyword can have at most " +
                MAX_SEARCH_HISTORY_ITEM_LENGTH +
                " length"
            );
        });
      },
      set: (value) => value.map((val) => val.toLowerCase()),
    },
    // isMobileVerified: true,
    // isEmailVerified: true,
    // isPremium: false,
  },
  { timestamps: true, discriminatorKey: "role" }
);

UserSchema.methods.getJWT = function () {
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ _id: this._id }, SECRET_KEY, { expiresIn: "7d" });
  return token;
};

UserSchema.methods.validatePassword = async function (plainPassword) {
  const passwordHash = this.password;
  const result = await bcrypt.compare(plainPassword, passwordHash);
  return result;
};

UserSchema.pre("save", async function () {
  try {
    const SALT_ROUNDS = parseInt(process.env.HASHING_NUMBER_OF_SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(this.password, SALT_ROUNDS);
    this.password = passwordHash;
  } catch (err) {
    console.log(err.message);
  }
});
const User = mongoose.model("User", UserSchema);
export default User;
