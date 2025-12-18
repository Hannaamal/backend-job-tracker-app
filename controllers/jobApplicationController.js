import JobApplication from "../models/jobApplication.js";
import Job from "../models/jobs.js";

export const applyForJob = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job || job.is_deleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      applicant: userId,
    });
   

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      company: job.company,
      resume: req.file ? req.file.path : null,
    });
     console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (err) {
    res.status(500).json({
      message: "Job application failed",
      error: err.message,
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({
      applicant: req.userData.userId,
      is_deleted: false,
    })
      .populate("job", "title location")
      .populate("company", "name");

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

