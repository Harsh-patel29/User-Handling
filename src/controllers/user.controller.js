import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const generateAccesssRefreshToken = async function (userID) {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateaccessToken();
    const refreshToken = user.generaterefreshToken();
    user.refreshToken = refreshToken;
    user.save({
      validateBeforeSave: false,
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somethig went wrong while generating access and refresh token"
    );
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;
  if (
    [fullname, email, password, username].some((field) => field?.trim === "")
  ) {
    throw new ApiError(404, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(404, "User with Username and email already exists");
  }
  const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
  const coverImageLocalFilePath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalFilePath) {
    throw new ApiError(404, "Avatar file is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalFilePath);
    console.log("Avatar file uploaded", avatar);
  } catch (error) {
    console.log("Error in uploading avatar File", error);
    throw new ApiError(500, "Failed to upload Avatar File");
  }
  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
    console.log("CoverImage file uploaded", coverImage);
  } catch (error) {
    console.log("Error in uploading coverImage File", error);
    throw new ApiError(500, "Failed to upload coverImage File");
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname,
      avatar: avatar.url,
      coverImage: coverImage.url,
      password,
    });
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user");
    }
    return res
      .status(201)
      .json(new ApiResponse(200, "User created Successfully", createdUser));
  } catch (error) {
    console.log("User creation failed", error);
    if (avatar) {
      await deleteFromCloudinary(avatarLocalFilePath);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImageLocalFilePath);
    }
    throw new ApiError(500, "User creation failed");
  }
});

const loginUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(404, "Username and email required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Wrong credentials");
  }
  const { accessToken, refreshToken } = await generateAccesssRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(404, "User not logged In");
  }
  const options = {
    httpOnly: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

const logOutUser = AsyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});

export { registerUser, loginUser, logOutUser };
