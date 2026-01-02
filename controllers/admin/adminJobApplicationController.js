import JobApplication from "../../models/jobApplication.js";
import Interview from "../../models/interviewScheduler.js";

/* ===============================
   GET ALL APPLICATIONS (ADMIN)
   GET /api/admin/applications
================================ */
export const getAllApplications = async (req, res) => {
  try {
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await JobApplication.find({ is_deleted: false })
      .populate("applicant", "name email")
      .populate("job", "title location")
      .populate("company", "name")
      .populate("interview")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

/* =================================
   UPDATE APPLICATION STATUS (ADMIN)
   PUT /api/admin/applications/:id/status
================================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("applicant", "name email")
      .populate("job", "title location")
      .populate("company", "name");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update application status",
    });
  }
};
