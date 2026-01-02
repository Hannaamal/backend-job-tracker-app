// models/Interview.js
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    interviewType: {
    type: String,
    enum: ["HR", "Technical", "Managerial"],  // <-- case-sensitive
    required: true,
  },
    mode: {
         type: String,
          enum: ["Online", "Onsite"],
           required: true
         },
    meetingLink: String, // Zoom / Google Meet

    location: String, // if offline

    date: {
      type: Date,
      required: true,
    },

    notes: String,
    status: {
      type: String,
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);