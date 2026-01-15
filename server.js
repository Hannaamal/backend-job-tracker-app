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
import { debugCookies } from "./controllers/debugController.js";



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



const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://job-portal-frontend-id1t-ihl5n2kez-amalhannas-projects.vercel.app", // production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman or curl

      // allow exact matches
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // allow any vercel preview deploy
      // if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      if (origin.includes(".vercel.app")) return callback(null, true);


      console.warn("Blocked by CORS:", origin);
      return callback(null, false); // reject gracefully
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




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

// Debug route to check cookies and JWT structure
app.get("/api/debug/cookies", debugCookies);



const PORT = process.env.PORT || 5000;

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred",
  });
});

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);



// Global error handler (REQUIRED)
