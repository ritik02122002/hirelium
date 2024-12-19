import express from "express";
import dotenv from "dotenv";
import DbConnection from "./utils/DbConnection.js";
import authRouter from "./routers/userAuthRouter.js";
import cookieParser from "cookie-parser";
import userProfileRouter from "./routers/userProfileRouter.js";
import jobRouter from "./routers/jobRouter.js";
import companyRouter from "./routers/companyRouter.js";
import recruiterRouter from "./routers/recruiterRouter.js";
const app = express();
dotenv.config({});

const PORT = process.env.APP_PORT;
DbConnection()
  .then(() => {
    console.log("successfully connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use(express.json());
app.use(cookieParser());
app.use("/user/auth", authRouter);
app.use("/user/profile", userProfileRouter);
app.use("/job", jobRouter);
app.use("/company", companyRouter);
app.use("/recruiter", recruiterRouter);
