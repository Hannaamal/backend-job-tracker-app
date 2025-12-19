import CompanySubscription from "../models/companySubscription.js";
import Company from "../models/company.js";



//subscribe company

export const subscribeCompany = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

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

    const subscription = await CompanySubscription.findOneAndUpdate(
      { user: userId, company: companyId },
      { is_active: false },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Unsubscribed successfully" });
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
