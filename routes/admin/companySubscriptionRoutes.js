import express from "express";
import userAuthCheck from "../../middleware/authCheck.js";
import { getCompanySubscribers } from "../../controllers/admin/companySubscriptionAdminController.js";

const adminCompanySubscriptionRouter = express.Router();

// Admin / Company owner
adminCompanySubscriptionRouter.get("/:companyId/subscribers",userAuthCheck,getCompanySubscribers);

export default adminCompanySubscriptionRouter;
