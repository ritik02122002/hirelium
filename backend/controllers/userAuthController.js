import JobSeeker from "../models/JobSeekerModel.js";
import Recruiter from "../models/RecruiterModel.js";
import User from "../models/UserModel.js";
import { sendOtp } from "../utils/helper.js";
import OTP from "../models/OtpModel.js";

export const register = async (req, res) => {
  try {
    const { firstName, email, password, role } = req.body;

    if (!firstName || !email || !password || !role)
      throw new Error("any of the mandatory field is missing");
    if (role != "JobSeeker" && role != "Recruiter") {
      throw new Error("Invalid role");
    }
    let user;
    if (role == "JobSeeker") {
      user = new JobSeeker({
        firstName,
        email,
        password,
        role,
      });
    } else {
      user = new Recruiter({
        firstName,
        email,
        password,
        role,
      });
    }

    await user.save();

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    return res.json({
      message: `${role}: ${firstName} added successfully`,
      status: "success",
      data: userWithoutPassword,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      throw new Error("any of the mandatory field is missing");
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    if (!(await user.validatePassword(password)))
      throw new Error("Invalid username or password");

    const { password: userPassword, ...userWithoutPassword } = user.toObject();

    const token = user.getJWT();
    res.cookie("token", token);
    res.json({
      message: `Welcome ${user.role}, ${user.firstName}`,
      status: "success",
      data: userWithoutPassword,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const logout = (req, res) => {
  res.cookie("token", null, { maxAge: 0 });
  res.json({
    message: `User logged out successfully`,
    status: "success",
  });
};

export const sendOtpForPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) throw new Error("email id not present");
    const user = await User.findOne({ email });
    if (!user) throw new Error("invalid email");

    await sendOtp(user.firstName, email, "passwordReset");

    res.json({
      message: `OTP sent successfully to ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    let { email, newPassword, otp } = req.body;
    const purpose = "passwordReset";
    otp = parseInt(otp);

    const otpInstance = await OTP.findOne({ email, otp, purpose });

    if (!otpInstance) throw new Error("invalid email or otp");

    let user = await User.findOne({ email });
    if (!user) throw new Error("invalid email or otp");

    user.password = newPassword;

    await user.save();
    res.json({
      message: `Password changed successfully for ${user.firstName}`,
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
