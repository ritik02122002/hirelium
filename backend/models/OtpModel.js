import mongoose from "mongoose";
import validator from "validator";

const OTPSchema = new mongoose.Schema({
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
  otp: {
    type: Number,
    required: true,
    min: 100000,
    max: 999999,
  },
  createdAt: {
    type: Date,
    expires: 300,
    default: Date.now,
  },
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
