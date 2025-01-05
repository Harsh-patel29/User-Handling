import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const connectDB = async function () {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `Mongo DB Connected Successfully!! DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongo DB connection error", error);
    process.exit(1);
  }
};
export { connectDB };
