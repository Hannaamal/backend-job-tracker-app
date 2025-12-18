import Job from "../models/jobs.js";
import Company from "../models/company.js";

// CREATE JOB (Admin only)

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      requiredSkills,
      company,
      expiresAt,
    } = req.body;

    // Validate company
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ message: "Company not found" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      requiredSkills,
      company,
      expiresAt,
      postedBy: req.userData.userId,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL JOBS (Public)

export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate("company", "name logo location")
      .populate("requiredSkills", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * GET JOB BY ID
 */
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company", "name logo location")
      .populate("requiredSkills", "name");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

/**
 * GET JOBS BY COMPANY
 */
export const getJobsByCompany = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      company: req.params.companyId,
      isActive: true,
    })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE JOB (Admin only)
 */
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE (DISABLE) JOB (Admin only)
 */
export const deleteJob = async (req, res) => {
  try {
    // 🔐 Admin check
    if (req.userData.userRole !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Only admin can delete jobs",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job || job.isActive === false) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 Soft delete
    job.isActive = false;
    await job.save();

    res.status(200).json({
      message: "Job disactivted successfully (soft delete)",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
