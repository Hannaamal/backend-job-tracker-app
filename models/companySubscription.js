import mongoose from "mongoose";

const companySubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate subscriptions
companySubscriptionSchema.index(
  { user: 1, company: 1 },
  { unique: true }
);

export default mongoose.model(
  "CompanySubscription",
  companySubscriptionSchema
);
