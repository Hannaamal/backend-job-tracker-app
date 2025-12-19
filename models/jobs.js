import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "1-3", "3-5", "5+"],
    },

    salaryRange: {
      min: Number,
      max: Number,
    },

    // 🔗 REQUIRED SKILLS (for matching)
    requiredSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    // 🔗 COMPANY REFERENCE
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // WHO POSTED THE JOB (admin / recruiter)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
