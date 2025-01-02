import Company from "../models/CompanyModel.js";
import {
  VALID_COMPANY_DETAILS,
  VALID_COMPANY_UPDATES,
} from "../utils/constant.js";

export const registerCompany = async (req, res) => {
  try {
    const companyDetails = req.body;
    const areDetailsValid = Object.keys(companyDetails).every((detail) =>
      VALID_COMPANY_DETAILS.includes(detail)
    );
    if (!areDetailsValid) throw new Error("invalid details");
    if (!companyDetails.companyDomain)
      throw new Error("missing company domain");
    const company = await Company.findOne({
      companyDomain: companyDetails.companyDomain,
    });
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

export const updateCompanyDetails = async (req, res) => {
  try {
    const { user } = req;
    const { companyId, ...companyDetails } = req.body;
    if (!companyId) throw new Error("company id is missing");

    const isUpdateValid = Object.keys(companyDetails).every((detail) =>
      VALID_COMPANY_UPDATES.includes(detail)
    );
    if (!isUpdateValid) throw new Error("invalid company details");

    let company = await Company.findById(companyId);
    if (!company) throw new Error("company does not exist");
    const companiesList = user.companyDetails;
    const isCompanyEmailVerified = companiesList.some((comp) =>
      comp.companyId.equals(companyId)
    );
    if (!isCompanyEmailVerified)
      throw new Error("recruiter does not belong to company");

    Object.keys(companyDetails).forEach((detail) => {
      company[detail] = companyDetails[detail];
    });
    await company.save();
    res.json({
      message: `${company.name}'s detail updated successfully `,
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

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json({
      message: `companies fetched successfully`,
      status: "success",
      data: companies,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};
