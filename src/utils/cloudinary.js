import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localfilePath) => {
  if (!localfilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localfilePath);
    console.log("File uploaded to cloudinary!! File src" + response.url);
    fs.unlinkSync(localfilePath);
    return response;
  } catch (error) {
    console.log("Error in uploading to cloudinary", error);
    throw new ApiError(
      500,
      "Something went wrong in uploading file to cloudinary"
    );
  }
};
const deleteFromCloudinary = async (publicID) => {
  try {
    const result = cloudinary.uploader.destroy(publicID);
    console.log(`File with publicID ${publicID} deleted from cloudinary`);
  } catch (error) {
    console.log("Error in deleting file from cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
