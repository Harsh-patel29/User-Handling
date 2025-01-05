import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { Upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
<<<<<<< HEAD
=======
import { logOutUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
>>>>>>> 167f0ff (Create Login and LogOut)
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
<<<<<<< HEAD
=======
router.route("/logout").post(verifyJwt, logOutUser);
>>>>>>> 167f0ff (Create Login and LogOut)
export default router;
