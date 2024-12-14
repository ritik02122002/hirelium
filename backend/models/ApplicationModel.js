import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["Applied", "Shortlisted", "Interviewed", "Rejected", "Offered"],
  },
},{timestamps:true});

const Application = new mongoose.model("Application", ApplicationSchema);
export default Application;
