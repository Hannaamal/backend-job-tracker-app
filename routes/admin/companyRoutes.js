import express from 'express'
import { createCompany, getCompanies,getCompanyById,deleteCompany, updateCompany } from "../../controllers/companyController.js";
import userAuthCheck from '../../middleware/authCheck.js';
import uploadLogo from '../../middleware/fileUpload/logoUpload.js';

const companyRouter = express.Router();

companyRouter.get("/view",getCompanies);
companyRouter.get("/:id",getCompanyById);
companyRouter.post("/add", userAuthCheck,uploadLogo.single("logo"),createCompany);
companyRouter.put("/update/:id",userAuthCheck,uploadLogo.single("logo"), updateCompany)
companyRouter.put("/delete/:id",userAuthCheck,deleteCompany)



export default companyRouter;
