import CompanySubscription from "../../models/companySubscription.js";
import Company from "../../models/company.js";

export const getCompanySubscribers = async (req, res) => {
  try {
    const { companyId } = req.params;

    // 🔐 Admin only
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Fetch subscribers
    const subscribers = await CompanySubscription.find({
      company: companyId,
      is_active: true,
    }).populate("user", "name email");

    res.status(200).json({
      company: company.name,
      totalSubscribers: subscribers.length,
      subscribers,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch subscribers",
      error: err.message,
    });
  }
};
