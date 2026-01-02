import express from "express"
import { register, login ,me, logout} from "../controllers/authController.js";
import { check } from "express-validator";
import userAuthCheck from "../middleware/authCheck.js";


const authRouter = express.Router();

authRouter.post("/register", [
    check("name").notEmpty().withMessage("Name is required").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 5 }).withMessage("Password must be at least 6 characters"),
    // check("phone").notEmpty().withMessage("Phone is required").isLength({ max: 10 }).withMessage("phone number must be  10 characters")
], register);
authRouter.post("/login",[
    check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    check("password").notEmpty().withMessage("Password is required").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
],  login);

authRouter.get("/me", userAuthCheck,me)

authRouter.post("/logout",logout)

export default authRouter;