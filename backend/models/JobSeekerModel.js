import mongoose from "mongoose";
import User from "./UserModel.js";
import {
  JOBSEEKER_SKILL_MAX_LENGTH,
  JOBSEEKER_MAX_SKILLS,
  JOBSEEKER_ABOUT_MIN_LENGTH,
  JOBSEEKER_ABOUT_MAX_LENGTH,
} from "../utils/constant.js";

const JobSeekerSchema = new mongoose.Schema({
  skills: {
    type: [String],
    validate: (value) => {
      if (value.length > JOBSEEKER_MAX_SKILLS)
        throw new Error(
          "you can add at most" + JOBSEEKER_MAX_SKILLS + "skills"
        );
      value.forEach((skill) => {
        if (skill.length > 20)
          throw new Error(
            "Each skills can have at most " +
              JOBSEEKER_SKILL_MAX_LENGTH +
              " length"
          );
      });
    },
  },
  resumeDetails: {
    resumeURL: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("invalid resume URL");
        }
      },
    },
    resumeDisplayName: {
      type: String,
      maxLength: 50,
    },
    uploadDate: {
      type: Date,
    },
  },

  about: {
    type: String,
    minLength: JOBSEEKER_ABOUT_MIN_LENGTH,
    maxLength: JOBSEEKER_ABOUT_MAX_LENGTH,
  },
  currentLocation: {
    type: String,
  },
  noticePeriod: {
    type: String,
    enum: [
      "Immediate",
      "15 Days or Less",
      "1 month",
      "2 months",
      "3 months",
      "6 months",
    ],
    default: "Immediate",
  },
  jobSearchStatus: {
    type: String,
    enum: ["Active", "Looking", "Not Looking"],
    default: "Active",
  },
  // savedJobs: { type: [mongoose.Schema.Types.ObjectId] },
  experience: [
    {
      company: { type: String, required: true },
      designation: { type: String, required: true },
      startYear: {
        type: Number,
      },
      endYear: {
        type: Number,
      },
      startMonth: {
        type: Number,
        min: 1,
        max: 12,
      },
      endMonth: {
        type: Number,
        min: 1,
        max: 12,
      },
      jobType: {
        type: String,
        enum: ["Full-time", "Internship"],
      },
      currentCompany: { type: Boolean },
      salary: { type: Number },
      description: { type: String },
    },
  ],
  education: [
    {
      institute: {
        type: String,
        required: true,
      },
      course: {
        type: String,
        required: true,
      },
      specialization: {
        type: String,
      },
      startYear: {
        type: Number,
      },

      endYear: {
        type: Number,
      },

      grade: {
        type: Number,
        min: 1,
        max: 10,
      },
      currentEducation: { type: Boolean },
    },
  ],
  jobPreferences: {
    locations: { type: [String] },
    roles: { type: [String] },
    expectedSalary: { from: Number, to: Number },
    jobType: { type: String, enum: ["Full-time", "Internship"] },
  },

  languages: [
    {
      language: {
        type: String,
        reqyired: true,
      },
      proficiency: {
        type: String,
        enum: ["Beginner", "Proficient", "Expert"],
      },
      read: { type: Boolean },
      write: { type: Boolean },
      speak: { type: Boolean },
    },
  ],
  //profileCompletion initially 10% for mandatory firstName,lastName,email,password
  // "videoProfile"
});

const JobSeeker = User.discriminator("JobSeeker", JobSeekerSchema);
export default JobSeeker;
