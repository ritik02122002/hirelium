import mongoose from "mongoose";
//"mongodb+srv://ritikgoyal4019:4eE8aI1TL0ST2edr@cluster0.4mrfb.mongodb.net/";
const DbConnection = async () => {
  try {
    return mongoose.connect("mongodb://localhost:27017/jobPortal");
  } catch (err) {
    console.error(err);
  }
};

export default DbConnection;
