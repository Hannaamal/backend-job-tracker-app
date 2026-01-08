import mongoose from "mongoose";
import JobApplication from "../models/jobApplication.js";
import Job from "../models/jobs.js";


export const checkJobApplied = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const { jobId } = req.params;
  

    const alreadyApplied = await JobApplication.exists({
      job: jobId,
      applicant: userId,
      is_deleted: false,
    });

    return res.status(200).json({
      applied: !!alreadyApplied,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to check application status",
      error: error.message,
    });
  }
};


export const applyForJob = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const jobId = req.params.jobId;
    const { experience } = req.body; //  get experience

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
       experience, // ✅ SAVE EXPERIENCE
    });

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
    const userId = new mongoose.Types.ObjectId(req.userData.userId);

    const applications = await JobApplication.find({
      applicant: userId,
      is_deleted: false
    })
      .populate("job", "title location")
      .populate("company", "name logo location")
      .populate("interview")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};



/*
 WITHDRAW APPLICATION
 */


export const withdrawApplication = async (req, res, next) => {
  try {
    const applicantId = req.userData.userId; // from auth middleware
    const jobId = req.params.jobId;

    // Find the application
    const application = await JobApplication.findOne({
      job: jobId,
      applicant: applicantId,
      is_deleted: false, // only active applications
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Soft delete by setting is_deleted to true
    application.is_deleted = true;
    await application.save();

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    next(error);
  }
};





