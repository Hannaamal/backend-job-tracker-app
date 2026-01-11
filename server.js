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
import notificationRouter from "./routes/notificationRoutes.js"
import cookieParser from "cookie-parser";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import saveRouter from "./routes/saveJobRoutes.js";
import adminApplicationRouter from "./routes/admin/adminApplicationRoutes.js"
import dashboardRouter from "./routes/admin/dashboardRoutes.js"
import interviewRouter from "./routes/admin/interviewSchedulerRoutes.js"



dotenv.config();
const app = express();
app.disable("etag");

// cookies
app.use(cookieParser());

// Middleware
app.use(express.json());

//file upload



app.use("/uploads", express.static("uploads"));



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));



app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true,               // allow cookies/auth headers
}));

// Routes
app.use('/api/job',jobRouter)
app.use('/api/auth',authRouter)
app.use('/api/profile',profileRouter)
app.use('/api/skills',skillRouter)
app.use('/api/company',companyRouter)
app.use('/api/application',applyRouter)
app.use('/api/company-subscriptions',subscribeRouter)

app.use("/api/admin/company-subscriptions",adminCompanySubscriptionRouter);
app.use('/api/notifications', notificationRouter);
app.use("/api/savejob/",saveRouter)

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/application",adminApplicationRouter)
app.use("/api/admin/interview",interviewRouter)
app.use("/api/admin/dash",dashboardRouter)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
