import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    //  Reference to User (AUTH)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },

    phone: { type: String },
    location: { type: String },

    title: { type: String }, // Mern Stack Developer
    experienceLevel: {
      type: String,
      enum: ["Fresher", "1-3", "3-5", "5+"],
    },

    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],

    summary: { type: String },

    education: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    resume: {
      url: String,
      uploadedAt: Date,
    },

    preferences: {
      jobType: String,
      remoteOnly: Boolean,
      preferredLocations: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
