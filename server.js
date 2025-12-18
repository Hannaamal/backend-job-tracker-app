import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRouter from "./routes/authRoutes.js"
import profileRouter from "./routes/profileRoutes.js"
import skillRouter from "./routes/skillRoutes.js"
import companyRouter from "./routes/admin/companyRoutes.js"

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
