import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    description:{
         type:String
        },
    website:{
      type:String
    },
    email:{
      type:String,
      required:true
    },
    logo: {
        type: String, 
        default: "/uploads/logos/default-logo.png", 
    },
    location:{
        type:String,
        required:true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    is_deleted:{
        type: Boolean,
        required:true,
        default:false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
