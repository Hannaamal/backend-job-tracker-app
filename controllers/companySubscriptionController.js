import CompanySubscription from "../models/companySubscription.js";
import Company from "../models/company.js";



//subscribe company

export const subscribeCompany = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { companyId } = req.params;

    // ✅ Check company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // ✅ Check existing subscription
    const existingSubscription = await CompanySubscription.findOne({
      user: userId,
      company: companyId,
    });

    // 🟢 Already subscribed
    if (existingSubscription && existingSubscription.is_active) {
      return res.status(200).json({
        message: "Already subscribed to this company",
      });
    }

    // 🔄 Re-subscribe OR create new
    const subscription = await CompanySubscription.findOneAndUpdate(
      { user: userId, company: companyId },
      { is_active: true },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Subscribed to company successfully",
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//unsubscribe Company

export const unsubscribeCompany = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { companyId } = req.params;

    const subscription = await CompanySubscription.findOne({
      user: userId,
      company: companyId,
    });

    // ❌ Never subscribed
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    // ⚠️ Already unsubscribed
    if (!subscription.is_active) {
      return res.status(200).json({
        message: "Already unsubscribed from this company",
      });
    }

    // ✅ Unsubscribe
    subscription.is_active = false;
    await subscription.save();

    res.status(200).json({
      message: "Unsubscribed successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//view all company

export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await CompanySubscription.find({
      user: req.userData.userId,
      is_active: true,
    }).populate("company", "name logo location");

    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
