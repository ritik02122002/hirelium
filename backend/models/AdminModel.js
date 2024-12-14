import mongoose from "mongoose";
import User from "./UserModel.js";
const AdminSchema = new mongoose.Schema({
  blocklistedUserEmails: {
    type: ["String"],
  },
});

const Admin = User.discriminator("Admin", AdminSchema);

export default Admin;
