import mongoose from "mongoose";
import JobApplication from "../models/jobApplication.js";
import Job from "../models/jobs.js";
import Profile from "../models/profile.js";

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

// export const applyForJob = async (req, res) => {
//   try {
//     const userId = req.userData.userId;
//     const jobId = req.params.jobId;
//     const { experience } = req.body; //  get experience

//     const job = await Job.findById(jobId);
//     if (!job || job.is_deleted) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const alreadyApplied = await JobApplication.findOne({
//       job: jobId,
//       applicant: userId,
//     });

//     if (alreadyApplied) {
//       return res.status(400).json({ message: "Already applied for this job" });
//     }

//     const application = await JobApplication.create({
//       job: jobId,
//       applicant: userId,
//       company: job.company,
//       resume: req.file ? req.file.path : null,
//        experience, // ✅ SAVE EXPERIENCE
//     });

//     res.status(201).json({
//       message: "Job applied successfully",
//       application,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Job application failed",
//       error: err.message,
//     });
//   }
// };

export const applyForJob = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const jobId = req.params.jobId;
    const { experience, resumeUrl } = req.body; // Add resumeUrl parameter

    const job = await Job.findById(jobId);
    if (!job || job.isDeleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    const alreadyApplied = await JobApplication.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    // Handle resume - either uploaded file or existing resume URL
    let resumeData = null;

    if (req.file) {
      // User uploaded a new file
      resumeData = req.file.path;
    } else if (resumeUrl) {
      // Validate that the resume URL belongs to the current user
      const userProfile = await Profile.findOne({ user: userId });

      if (
        !userProfile ||
        !userProfile.resume ||
        userProfile.resume.url !== resumeUrl
      ) {
        return res.status(400).json({ message: "Invalid resume URL" });
      }

      resumeData = resumeUrl;
    } else {
      return res
        .status(400)
        .json({ message: "Please provide either a resume file or resume URL" });
    }

    const application = await JobApplication.create({
      job: jobId,
      applicant: userId,
      company: job.company,
      resume: resumeData,
      experience,
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
      is_deleted: false,
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

// controllers/jobApplicationController.js
export const withdrawApplication = async (req, res, next) => {
  try {
    const applicantId = req.userData.userId;
    const applicationId = req.params.applicationId; // ✅ application ID

    const deletedApplication = await JobApplication.findOneAndDelete({
      _id: applicationId,
      applicant: applicantId,
    });

    if (!deletedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application withdrawn successfully",
      deletedApplicationId: deletedApplication._id,
    });
  } catch (error) {
    next(error);
  }
};
