import { Router } from "express";
import * as adminController from "../controllers/admin.js";
import { isAuthenticated } from "../middlewares/adminAuth.js";
import multer from "multer";
const router = Router();

const upload = multer();

router.get("/check-admin", isAuthenticated, adminController.checkAdmin);
router.post("/make-admin", isAuthenticated, adminController.makeAdmin);
router.get("/all-admins", isAuthenticated, adminController.getAllAdmins);
router.post("/remove-admin", isAuthenticated, adminController.removeAdmin);
router.post("/add-jobs", isAuthenticated, adminController.addJobs);
router.post(
  "/add-blog",
  isAuthenticated,
  upload.none(),
  adminController.createBlog
);
export default router;
