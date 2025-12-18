import JobApplication from "../models/jobApplication.js";


export const getApplicationsForJob = async (req, res) => {
  try {
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await JobApplication.find({
      job: req.params.jobId,
      is_deleted: false,
    })
      .populate("applicant", "name email")
      .populate("job", "title");

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job applications" });
  }
};
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
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};
