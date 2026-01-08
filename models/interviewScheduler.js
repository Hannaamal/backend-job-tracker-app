// models/interviewScheduler.js
import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
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

  // 🔹 HOW interview is conducted
  interviewMode: {
    type: String,
    enum: ["Walk-in", "Slot-based"],
    required: true,
  },

  // 🔹 WHERE interview happens
  medium: {
    type: String,
    enum: ["Online", "Onsite"],
    required: true,
  },

  interviewType: {
    type: String,
    enum: ["HR", "Technical", "Managerial"],
    required: true,
  },

  meetingLink: {
    type: String,
    required: function () {
      return this.medium === "Online";
    },
  },

  location: {
    type: String,
    required: function () {
      return this.medium === "Onsite";
    },
  },

  date: {
    type: Date,
    required: true,
  },

  timeRange: {
    start: String,
    end: String,
  },

  instructions: String,

  status: {
    type: String,
    enum: ["Scheduled", "Cancelled", "Completed"],
    default: "Scheduled",
  },
});


export default mongoose.model("Interview", interviewSchema);
