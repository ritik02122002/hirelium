import mongoose from "mongoose";

const DbConnection = async () => {
  try {
    const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;
    return mongoose.connect(MONGODB_CONNECTION_STRING);
  } catch (err) {
    console.error(err);
  }
};

export default DbConnection;
