import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/authRoutes.js"
import profileRouter from "./routes/profileRoutes.js"
import skillRouter from "./routes/skillRoutes.js"
import companyRouter from "./routes/admin/companyRoutes.js"
import jobRouter from "./routes/admin/jobRoutes.js"
import applyRouter from "./routes/jobApplicationRoutes.js"
import subscribeRouter from "./routes/companySubscriptionRoutes.js"
import adminCompanySubscriptionRouter from "./routes/admin/companySubscriptionRoutes.js"

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//file upload

app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/skills',skillRouter)
app.use('/api/company',companyRouter)
app.use('/api/job',jobRouter)
app.use('/api/application',applyRouter)
app.use('/api/company-subscriptions',subscribeRouter)

app.use("/api/admin/company-subscriptions",adminCompanySubscriptionRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
