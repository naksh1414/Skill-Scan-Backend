import express from "express";
import { addReview } from "../controllers/review.js";

const router = express.Router();

router.post("/save-review", addReview);
// router.post("/get-reviews", login);
// router.post("/update-review", logout);

export default router;
