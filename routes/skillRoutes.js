// routes/skillRoutes.js
import express from "express";
import {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";
import { check } from "express-validator";


const skillRouter = express.Router();

const createSkillValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Skill name is required")
    .isLength({ min: 2 })
    .withMessage("Skill name must be at least 2 characters"),

  check("category")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Category must be at least 2 characters"),
];

const updateSkillValidator = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Skill name must be at least 2 characters"),

  check("category")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Category must be at least 2 characters"),
];

skillRouter.get("/", getSkills);
skillRouter.get("/:id", getSkillById);
skillRouter.post("/",createSkillValidator, createSkill);
skillRouter.put("/:id",updateSkillValidator,updateSkill);
skillRouter.delete("/:id", deleteSkill);

export default skillRouter;
