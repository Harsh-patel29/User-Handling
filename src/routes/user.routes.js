import { Router } from "express";
import { Upload } from "../middlewares/multer.middleware.js";
import {
  registerUser,
  loginUser,
  changeCurrentPassword,
  logOutUser,
  getUserDetails,
  updateAccountDetails,
  updateAvatarImage,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();
const UploadText = multer();

router.route("/register").post(
  Upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(UploadText.none(), loginUser);

router.route("/logout").post(verifyJwt, logOutUser);
router
  .route("/changepassword")
  .post(UploadText.none(), verifyJwt, changeCurrentPassword);

router.route("/getdetails").get(verifyJwt, getUserDetails);
router
  .route("/accountdetails")
  .post(UploadText.none(), verifyJwt, updateAccountDetails);

router.route("/updateavatar").post(
  Upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateAvatarImage
);

router.route("/updatecoverimage").post(
  Upload.fields([
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  verifyJwt,
  updateCoverImage
);

export default router;
