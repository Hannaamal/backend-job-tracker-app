// controllers/skillController.js
import Skill from "../models/skills.js";
import HttpError from "../helpers/httpError.js";
import { validationResult } from "express-validator";

/* GET ALL SKILLS */
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ name: 1 }); // sorted alphabetically
    res.status(200).json(skills);
  } catch (error) {
    next(new HttpError("Failed to fetch skills", 500));
  }
};

/* GET SKILL BY ID */
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return next(new HttpError("Skill not found", 404));
    }
    res.status(200).json(skill);
  } catch (error) {
    next(new HttpError("Failed to fetch skill", 500));
  }
};

/* CREATE NEW SKILL */
export const createSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    const { name, category } = req.body;

    // Check for duplicates
    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return next(new HttpError("Skill already exists", 400));
    }

    const skill = new Skill({ name, category });
    await skill.save();

    res.status(201).json({ message: "Skill created successfully", skill });
  } catch (error) {
    next(new HttpError("Failed to create skill", 500));
  }
};

/* UPDATE SKILL */
export const updateSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    const { name, category } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, category },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return next(new HttpError("Skill not found", 404));
    }

    res.status(200).json({ message: "Skill updated successfully", skill });
  } catch (error) {
    next(new HttpError("Failed to update skill", 500));
  }
};

/* DELETE SKILL */
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return next(new HttpError("Skill not found", 404));
    }
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    next(new HttpError("Failed to delete skill", 500));
  }
};
