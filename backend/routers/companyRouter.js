import express from "express";
import authentication from "../middlewares/authentication.js";
import authorizeRecruiter from "../middlewares/authorizeRecruiter.js";
import {
  getAllCompanies,
  getCompanyDetails,
  registerCompany,
  updateCompanyDetails,
} from "../controllers/companyController.js";
const companyRouter = express.Router();

companyRouter.post(
  "/register",
  authentication,
  authorizeRecruiter,
  registerCompany
);
companyRouter.patch(
  "/update",
  authentication,
  authorizeRecruiter,
  updateCompanyDetails
);
companyRouter.get("/view/:companyId", getCompanyDetails);
companyRouter.get("/", getAllCompanies);
export default companyRouter;
