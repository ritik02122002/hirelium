import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Company = new mongoose.model("Company", CompanySchema);
export default Company;
