import { Router } from "express";
import * as blogController from "../controllers/blogs.js";
import multer from "multer";

const upload = multer();
import { isAuthenticated } from "../middlewares/adminAuth.js";
const router = Router();

router.get("/all-blogs", blogController.getBlogs);
router.get(
  "/all-blogs-for-admin",
  isAuthenticated,
  blogController.getBlogsForAdmin
);
router.delete(
  "/all-blogs-for-admin/:id",
  isAuthenticated,
  blogController.deleteBlog
);
router.put(
  "/update-blog",
  isAuthenticated,
  upload.none(),
  blogController.updateBlog
);
router.get("/specific-blog/:slug", blogController.getBlogById);

export default router;
