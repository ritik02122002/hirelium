import mongoose from "mongoose";
import User from "./UserModel.js";

const RecruiterSchema = new mongoose.Schema({
  companyDetails: [
    {
      companyId: { type: mongoose.Schema.Types.ObjectId },
      designation: {
        type: String,
      },
    },
  ],

  bookmarkedJObSeekersId: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Recruiter = User.discriminator("Recruiter", RecruiterSchema);

export default Recruiter;
