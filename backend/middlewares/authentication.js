import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
const authentication = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token absent");
    }
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const { _id } = decodedToken;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      status: "failure",
      message: err.message,
    });
  }
};

export default authentication;
