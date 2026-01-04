import Company from "../../models/company.js";
import Job from "../../models/jobs.js";
import Application from "../../models/jobApplication.js";
import Interview from "../../models/interviewScheduler.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { company } = req.query;

    /* ---------------- COMPANY FILTER ---------------- */
    let companyIds = [];
    if (company) {
      const companies = await Company.find({
        name: { $regex: company, $options: "i" },
      }).select("_id");

      companyIds = companies.map((c) => c._id);
    }

    const jobFilter = companyIds.length
      ? { company: { $in: companyIds } }
      : {};

    /* ---------------- BASIC COUNTS ---------------- */
    const [jobs, shortlisted, hired] = await Promise.all([
      Job.countDocuments(jobFilter),
      Application.countDocuments({ ...jobFilter, status: "shortlisted" }),
      Application.countDocuments({ ...jobFilter, status: "hired" }),
    ]);

    /* ---------------- INTERVIEWS COUNT (FIXED) ---------------- */
    const interviewsAgg = await Interview.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      ...(companyIds.length
        ? [{ $match: { "job.company": { $in: companyIds } } }]
        : []),
      { $count: "count" },
    ]);

    const interviews = interviewsAgg[0]?.count || 0;

    /* ---------------- APPLICATIONS BY JOB ---------------- */
    const applications = await Application.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      ...(companyIds.length
        ? [{ $match: { "job.company": { $in: companyIds } } }]
        : []),
      {
        $group: {
          _id: {
            title: "$job.title",
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.title",
          received: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "applied"] }, "$count", 0],
            },
          },
          hold: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "on-hold"] }, "$count", 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$_id.status", "rejected"] }, "$count", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          received: 1,
          hold: 1,
          rejected: 1,
        },
      },
    ]);

    /* ---------------- JOB STATS (LAST 7 DAYS) ---------------- */
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    const jobStatsRaw = await Application.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      ...(companyIds.length
        ? [
            {
              $lookup: {
                from: "jobs",
                localField: "job",
                foreignField: "_id",
                as: "job",
              },
            },
            { $unwind: "$job" },
            { $match: { "job.company": { $in: companyIds } } },
          ]
        : []),
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const jobStats = last7Days.map((day) => {
      const found = jobStatsRaw.find((d) => d._id === day);
      return found ? found.count : 0;
    });

    /* ---------------- RESPONSE ---------------- */
    res.json({
      interviews,
      shortlisted,
      hired,
      jobs,
      applications,
      jobStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
