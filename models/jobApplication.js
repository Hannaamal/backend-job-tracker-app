import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    resume: {
      type: String, // URL or file path
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "hired"],
      default: "applied",
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobApplication", jobApplicationSchema);
