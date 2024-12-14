import express from "express";
import dotenv from "dotenv";
import DbConnection from "./utils/DbConnection.js";
import authRouter from "./routers/userAuthRouter.js";
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
app.use("/user/auth", authRouter);
