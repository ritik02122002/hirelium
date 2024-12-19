import mongoose from "mongoose";
import validator from "validator";
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    logo: {
      type: String,
      validate: (value) => {
        if (!validator.isURL(value)) throw new Error("logo URL is invalid");
      },
    },
    description: {
      type: String,
      minLength: 20,
      maxLength: 5000,
    },
    companyDomain: {
      type: String,
      required: true,
      unique: true,
      minLength: 4,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Company = new mongoose.model("Company", CompanySchema);
export default Company;
