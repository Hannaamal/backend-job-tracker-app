// routes/skillRoutes.js
import express from "express";
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const skillRouter = express.Router();

skillRouter.get("/", getSkills);
skillRouter.get("/:id", getSkillById);
skillRouter.post("/", createSkill);
skillRouter.put("/:id", updateSkill);
skillRouter.delete("/:id", deleteSkill);

export default skillRouter;
