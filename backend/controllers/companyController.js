import Company from "../models/CompanyModel.js";
import { VALID_COMPANY_DETAILS } from "../utils/constant.js";

export const registerCompany = async (req, res) => {
  try {
    const companyDetails = req.body;
    const areDetailsValid = Object.keys(companyDetails).every((detail) =>
      VALID_COMPANY_DETAILS.includes(detail)
    );
    if (!areDetailsValid) throw new Error("invalid details");
    if (!companyDetails.website) throw new Error("missing company website");
    const company = await Company.findOne({ website: companyDetails.website });
    if (company) throw new Error("company already exists");
    const comp = new Company(companyDetails);
    await comp.save();
    res.json({
      message: `Company: ${comp.name} registered successfully `,
      status: "success",
      data: comp,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId) throw new Error("Comapny id is invalid");
    const company = await Company.findById(companyId);
    if (!company) throw new Error("Comapny id is invalid");
    res.json({
      message: `${company.name}'s detail fetched successfully `,
      status: "success",
      data: company,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
