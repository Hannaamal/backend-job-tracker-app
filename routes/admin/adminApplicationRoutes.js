// routes/adminApplicationRoutes.js
import express from "express";
import {
  getAllApplications,
  updateApplicationStatus,
   updateApplicationsStatusByJob,
} from "../../controllers/admin/adminJobApplicationController.js";
import userAuthCheck from "../../middleware/authCheck.js";


const router = express.Router();

router.get("/applications", userAuthCheck, getAllApplications);
router.put("/applications/:id/status", userAuthCheck, updateApplicationStatus);

// routes/adminApplicationRoutes.js
router.put("/applications/jobs/:jobId/status", userAuthCheck, updateApplicationsStatusByJob);


export default router;