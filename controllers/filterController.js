import Job from "../models/jobs.js";
import Company from "../models/company.js";
import skill from "../models/skills.js"

export const getSearchSuggestions = async (req, res) => {
  try {
    // Get popular job titles
    const jobTitles = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$title", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { title: "$_id", count: 1, _id: 0 } }
    ]);

    // Get popular locations
    const locations = await Job.aggregate([
      { $match: { isActive: true, location: { $exists: true, $ne: "" } } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
      { $project: { location: "$_id", count: 1, _id: 0 } }
    ]);

    // Get popular companies
    const companies = await Company.aggregate([
      { $lookup: { from: "jobs", localField: "_id", foreignField: "company", as: "jobs" } },
      { $addFields: { jobCount: { $size: "$jobs" } } },
      { $match: { jobCount: { $gt: 0 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 10 },
      { $project: { name: 1, location: 1, jobCount: 1, _id: 0 } }
    ]);

    // Get popular job types
    const jobTypes = await Job.aggregate([
      { $match: { isActive: true, jobType: { $exists: true, $ne: "" } } },
      { $group: { _id: "$jobType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { jobType: "$_id", count: 1, _id: 0 } }
    ]);

    // Get popular experience levels
    const experienceLevels = await Job.aggregate([
      { $match: { isActive: true, experienceLevel: { $exists: true, $ne: "" } } },
      { $group: { _id: "$experienceLevel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
      { $project: { experienceLevel: "$_id", count: 1, _id: 0 } }
    ]);

    res.status(200).json({
      popularJobTitles: jobTitles.map(item => item.title),
      popularLocations: locations.map(item => item.location),
      popularCompanies: companies,
      popularJobTypes: jobTypes.map(item => item.jobType),
      popularExperienceLevels: experienceLevels.map(item => item.experienceLevel)
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch search suggestions",
      error: err.message,
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      company,
      jobType,
      experience,
      remote,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    // 🔍 Keyword search (title)
    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    // 📍 Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    
    // 🏢 Company filter (by name)
    if (company) {
      const companyDoc = await Company.findOne({
        name: { $regex: company, $options: "i" },
      });

      if (companyDoc) {
        query.company = companyDoc._id;
      } else {
        return res.status(200).json({
          jobs: [],
          total: 0,
          page: Number(page),
        });
      }
    }

    // 🕒 Job type
    if (jobType) {
      query.jobType = jobType;
    }

    // 📈 Experience
    if (experience) {
      query.experienceLevel = experience;
    }

    // 🌍 Remote
    if (remote !== undefined) {
      query.isRemote = remote === "true";
    }

    // Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate("company", "name location")
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
