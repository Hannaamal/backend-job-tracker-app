import express from 'express'
import { createCompany, getCompanies,getCompanyById,deleteCompany, updateCompany } from "../../controllers/companyController.js";
import userAuthCheck from '../../middleware/authCheck.js';
import uploadLogo from '../../middleware/fileUpload/logoUpload.js';
import optionalAuth from '../../middleware/optionalAuth.js';
import { check } from "express-validator";

const companyRouter = express.Router();


const createCompanyValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters"),

  check("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  check("email")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 10 characters"),
  check("website")
    .trim()
    .notEmpty()
    .withMessage("website is required"),

];

const updateCompanyValidator = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters"),

  check("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Location cannot be empty"),

  check("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  check("email")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 10 characters"),
  check("website")
    .trim()
    .notEmpty()
    .withMessage("website is required"),
];


companyRouter.get("/view",getCompanies);
companyRouter.get("/:id", optionalAuth,getCompanyById);
companyRouter.post("/add", userAuthCheck,uploadLogo.single("logo"),createCompanyValidator,createCompany);
companyRouter.put("/update/:id",userAuthCheck,uploadLogo.single("logo"),updateCompanyValidator,updateCompany)
companyRouter.put("/delete/:id",userAuthCheck,deleteCompany)



export default companyRouter;