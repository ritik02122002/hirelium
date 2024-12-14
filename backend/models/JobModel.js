import mongoose from "mongoose";
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    requirements: { type: [String], required: true },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    salary: {
      amount: {
        type: Number,
      },
      currency: {
        type: String,
        enum: ["Rs", "$"],
      },
      unit: {
        type: String,
        enum: ["pa", "pm"],
      },
    },
    jobType: { type: String, enum: ["Full-time", "Internship"] },
    locations: { type: [String] },
    role: { type: String, required: true },
    positions: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
