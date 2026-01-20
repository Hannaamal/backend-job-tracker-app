// routes/interviewRoutes.js
import express from "express";
import userAuthCheck from "../../middleware/authCheck.js";
import {
  scheduleInterview,
  updateInterviewSchedule,
  cancelInterviewSchedule,
  getInterviewByJob,
  getInterviewById,
} from "../../controllers/admin/interviewSchedulerController.js";

const interviewRouter = express.Router();

/**ADMIN – INTERVIEW SCHEDULER*/

interviewRouter.post("/jobs/:jobId/interviews",userAuthCheck,scheduleInterview);

/**Update Interview Schedule*/

interviewRouter.put("/interviews/:id",userAuthCheck,updateInterviewSchedule);

/**Cancel Interview Schedule*/

interviewRouter.delete("/interviews/:id",userAuthCheck,cancelInterviewSchedule);

/** Get Interview by Job (Admin View)*/

interviewRouter.get("/job/:jobId",userAuthCheck,getInterviewByJob);

/*Get Single Interview Details*/

interviewRouter.get("/interviews/:id",userAuthCheck,getInterviewById);





export default interviewRouter;
