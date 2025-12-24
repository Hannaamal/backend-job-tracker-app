import Job from "../models/jobs.js";
import Company from "../models/company.js";
import CompanySubscription from "../models/companySubscription.js";
import Profile from "../models/profile.js";
import { sendJobAlertEmail } from "../helpers/mailer.js";
import Notification from '../models/notification.js';



//JOB CREATION

export const createJob = async (req, res, next) => {
  try {
    if (req.userData.userRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create jobs' });
    }

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

    const companyDoc = await Company.findById(company);
    if (!companyDoc) return res.status(404).json({ message: 'Company not found' });

    // Check for duplicate active job
    const existingJob = await Job.findOne({ title, company, location, isActive: true });
    if (existingJob) {
      return res.status(409).json({ message: 'Active job already exists' });
    }

    // Create the job
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

    // 1️⃣ Send emails to subscribers whose skills match
    const subscriptions = await CompanySubscription.find({ company, is_active: true })
      .populate('user', 'name email');

    for (const sub of subscriptions) {
      const profile = await Profile.findOne({ user: sub.user._id });
      if (!profile || !profile.skills?.length) continue;

      const isMatched = profile.skills.some(profileSkill =>
        job.requiredSkills.some(jobSkill => jobSkill.equals(profileSkill))
      );
      if (!isMatched) continue;

      await sendJobAlertEmail(sub.user.email, {
        name: sub.user.name,
        jobTitle: job.title,
        company: companyDoc.name,
        location: job.location,
        experience: job.experienceLevel || 'Not specified',
        jobLink: `${process.env.FRONTEND_URL}/jobs/${job._id}`,
      });
    }

    // 2️⃣ Create in-app notifications for all users whose skills match
    const profiles = await Profile.find({ skills: { $exists: true, $not: { $size: 0 } } })
      .populate('user', 'name');

    for (const profile of profiles) {
      const isMatched = profile.skills.some(profileSkill =>
        job.requiredSkills.some(jobSkill => jobSkill.equals(profileSkill))
      );
      if (!isMatched) continue;

      await Notification.create({
        user: profile.user._id,
        job: job._id,
        title: `New job matching your skills: ${job.title}`,
        message: `${companyDoc.name} posted a new job that matches your skills.`,
      });
    }

    res.status(201).json({
      message: 'Job created, emails sent to subscribers & notifications sent to matching users',
      job,
    });

  } catch (error) {
    next(error);
  }
};






// GET ALL JOBS (Public)

export const getAllJobs = async (req, res, next) => {
  try {
    const {
      category,     // Skill.category
      jobTitle,     // Job.title
      location,
      company,
      jobType,
      experience,
      remote,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    /* =========================
       🔹 CATEGORY SEARCH
    ========================== */
    if (category) {
      query.category = category;
    }

    /* =========================
       🔹 JOB TITLE SEARCH
    ========================== */
    if (jobTitle) {
      query.title = { $regex: jobTitle, $options: "i" };
    }

    /* =========================
       📍 LOCATION
    ========================== */
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    /* =========================
       🏢 COMPANY
    ========================== */
    if (company) {
      const companyDoc = await Company.findOne({
        name: { $regex: company, $options: "i" },
      });

      if (!companyDoc) {
        return res.status(200).json({
          jobs: [],
          total: 0,
          page: Number(page),
        });
      }

      query.company = companyDoc._id;
    }

    /* =========================
       🕒 JOB TYPE
    ========================== */
    if (jobType) {
      query.jobType = jobType;
    }

    /* =========================
       📈 EXPERIENCE
    ========================== */
    if (experience) {
      query.experienceLevel = experience;
    }

    /* =========================
       🌍 REMOTE
    ========================== */
    if (remote !== undefined) {
      query.isRemote = remote === "true";
    }

    /* =========================
       📄 PAGINATION
    ========================== */
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query) // ✅ uses filters
      .populate("company", "name logo location")
      .populate("requiredSkills", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message,
    });
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
