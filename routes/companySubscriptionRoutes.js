import express from "express";
import userAuthCheck from "../middleware/authCheck.js";
import {
  subscribeCompany,
  unsubscribeCompany,
  getMySubscriptions,
} from "../controllers/companySubscriptionController.js";

const subscribeRouter = express.Router();

subscribeRouter.post("/:companyId/subscribe", userAuthCheck, subscribeCompany);
subscribeRouter.delete("/:companyId/unsubscribe", userAuthCheck, unsubscribeCompany);
subscribeRouter.get("/my", userAuthCheck, getMySubscriptions);

export default subscribeRouter;
