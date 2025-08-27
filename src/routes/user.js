import { Router } from "express";
import * as userController from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = Router();

router.get(
  "/get-user-profile/:profileId",
  isAuthenticated,
  userController.getUserProfile
);
router.post(
  "/update-resume-data",
  isAuthenticated,
  userController.updateResumeData
);

router.post("/send-otp", userController.handleOTPSending);
router.post("/forget-password", userController.handleForgetPassword);
router.post("/reset-password", userController.handleResetPassword);
export default router;
