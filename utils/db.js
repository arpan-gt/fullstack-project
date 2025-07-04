import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected to MongoDb");
    })
    .catch((err) => {
      console.log("error connecting to MongoDb", err);
    });
};

export default connectDB;