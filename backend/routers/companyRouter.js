import express from "express";
import authentication from "../middlewares/authentication.js";
import authorizeRecruiter from "../middlewares/authorizeRecruiter.js";
import {
  getCompanyDetails,
  registerCompany,
} from "../controllers/companyController.js";
const companyRouter = express.Router();

companyRouter.post(
  "/register",
  authentication,
  authorizeRecruiter,
  registerCompany
);
// companyRouter.patch("/update", authentication, authorizeRecruiter);
companyRouter.get("/view/:companyId", getCompanyDetails);

export default companyRouter;
