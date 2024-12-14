import JobSeeker from "../models/JobSeekerModel.js";
import Recruiter from "../models/RecruiterModel.js";
import User from "../models/UserModel.js";

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
    res.json({
      message: `${role} added successfully`,
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      throw new Error("any of the mandatory field is missing");
    if (role != "JobSeeker" && role != "Recruiter") {
      throw new Error("Invalid role");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid username or password");
    }
    if (user.role != role) throw new Error("No such user exists for this role");
    if (!(await user.validatePassword(password)))
      throw new Error("Invalid username or password");

    const token = user.getJWT();
    res.cookie("token", token);
    res.json({
      message: `Welcome ${user.firstName}`,
      status: "success",
      data: user,
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
