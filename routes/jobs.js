import { Router } from "express";
import * as jobController from "../controllers/jobs.js";

import { isAuthenticated } from "../middlewares/adminAuth.js";
const router = Router();

router.get("/get-jobs", jobController.getJobs);
router.get("/get-job/:id", jobController.getJob);
router.put("/update-job", isAuthenticated, jobController.updateJob);
router.delete("/delete-job", isAuthenticated, jobController.deleteJob);

export default router;
