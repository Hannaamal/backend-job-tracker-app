import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // "React", "Node.js"
    },
    category: {
      type: String, // Frontend, Backend, DevOps
    },
  },
  { timestamps: true }
);

export default mongoose.model("Skill", skillSchema);
