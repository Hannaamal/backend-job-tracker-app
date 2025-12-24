import Job from "../models/jobs.js";
import Company from "../models/company.js";
import skill from "../models/skills.js"

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
