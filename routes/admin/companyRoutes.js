import express from 'express'
import { createCompany, getCompanies,deleteCompany } from "../../controllers/admin/companyController.js";
import userAuthCheck from '../../middleware/authCheck.js';

const companyRouter = express.Router();

companyRouter.post("/add", userAuthCheck,createCompany);
companyRouter.get("/view", getCompanies);
companyRouter.put("/delete/:id",userAuthCheck,deleteCompany)

export default companyRouter;
