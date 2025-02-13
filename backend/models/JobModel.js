import mongoose from "mongoose";
import Company from "./CompanyModel.js";
import Recruiter from "./RecruiterModel.js";
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minLength: 3,
      maxLenth: 50,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      minLength: 3,
      maxLenth: 50,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      minLength: 30,
      maxLenth: 1000,
    },
    qualifications: {
      type: [String],
      required: true,
      validate: (value) => {
        if (value.length > 10)
          throw new Error("you can add at most 10 qualifications");
        if (value.length == 0) throw new Error("please add qualifications");
        value.forEach((qual) => {
          if (qual.length > 500)
            throw new Error("Each qualification can have at most 500 length");
        });
      },
    },
    responsibilities: {
      type: [String],
      required: true,
      validate: (value) => {
        if (value.length > 20)
          throw new Error("you can add at most 10 responsibilities");
        if (value.length == 0) throw new Error("please add responsibilities");
        value.forEach((res) => {
          if (res.length > 500)
            throw new Error("Each responsibility can have at most 500 length");
        });
      },
    },
    postedById: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Recruiter,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: Company,
    },
    salaryDetails: {
      minimumSalary: {
        type: Number,
        min: 0,
        max: 100000000,
      },
      maximumSalary: {
        //stored as p.a
        type: Number,
        min: 0,
        max: 100000000,
        validate: function (value) {
          if (this.minimumSalary && this.minimumSalary > value)
            throw new Error(
              "maximum salary must be greater than or equal to minimum salary"
            );
        },
      },
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "$"],
      },
    },

    additionalInfo: {
      type: [String],
      validate: (value) => {
        if (value.length > 20)
          throw new Error("you can add at most 20 additional info");
        value.forEach((info) => {
          if (info.length > 500)
            throw new Error("Each additional info can have at most 500 length");
        });
      },
    },
    workModel: {
      type: String,
      enum: ["On-Site", "Hybrid", "Remote"],
    },
    minimumExperience: {
      type: Number,
      min: 0,
      max: 50,
    },
    maximumExperience: {
      type: Number,
      min: 0,
      max: 50,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Internship"],
      required: true,
    },
    locations: {
      type: [String],
      validate: (value) => {
        if (value.length > 5)
          throw new Error("you can add at most 5 locations");
        value.forEach((loc) => {
          if (loc.length > 40)
            throw new Error("Each location can have at most 40 length");
        });
      },
      set: (value) => value.map((val) => val.toLowerCase()),
    },
    vacancy: {
      type: Number,
      min: 0,
    },
    appliedCount: {
      type: Number,
      default: 0,
    },
    keySkills: {
      type: [String],
      validate: (value) => {
        if (value.length > 20)
          throw new Error("you can add at most 20 key skills");
        if (value.length == 0) throw new Error("please add key skills");
        value.forEach((skill) => {
          if (skill.length > 50)
            throw new Error("Each skill can have at most 50 length");
        });
      },
      set: (value) => value.map((val) => val.toLowerCase()),
    },
    isJobActive: {
      type: Boolean,
      default: true,
    },
    isCoverLetterMandatory: {
      type: Boolean,
      default: true,
    },
    // "hideApplyButton": false, true for hr, admin and guests
    //showRecruiterDetail: false,  for premium
    //duration for internship
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);
export default Job;
