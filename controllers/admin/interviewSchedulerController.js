import Interview from "../../models/interviewScheduler.js";
import JobApplication from "../../models/jobApplication.js";
import Job from "../../models/jobs.js";
import { sendInterviewEmail } from "../../helpers/mailer.js";


/**
 * CREATE INTERVIEW
 * POST /jobs/:jobId/interviews
 */
export const scheduleInterview = async (req, res) => {
   console.log("🚀 scheduleInterview API HIT");
  console.log("📦 req.params:", req.params);
  console.log("📦 req.body:", req.body);
  try {
    const { jobId } = req.params;

    const {
      interviewMode, // Walk-in | Slot-based
      medium, // Online | Onsite
      interviewType, // HR | Technical | Managerial
      meetingLink,
      location,
      date,
      timeRange,
      instructions,
    } = req.body;

    // 🔎 Validate Job
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🧠 Conditional validation
    if (medium === "Online" && !meetingLink) {
      return res
        .status(400)
        .json({ message: "Meeting link is required for online interview" });
    }

    if (medium === "Onsite" && !location) {
      return res
        .status(400)
        .json({ message: "Location is required for onsite interview" });
    }

    // 📝 Create interview
    const interview = await Interview.create({
      job: job._id,
      company: job.company,
      interviewMode,
      medium,
      interviewType,
      meetingLink,
      location,
      date,
      timeRange,
      instructions,
    });

    // 🔁 UPDATE ALL APPLICATIONS (Walk-in logic)
    if (interviewMode === "Walk-in") {
      await JobApplication.updateMany(
        { job: job._id, status: "applied" },
        {
          status: "interview",
          interview: interview._id,
        }
      );
    }

    //Email notification to applicants
    const applications = await JobApplication.find({
      job: job._id,
    }).populate("applicant", "name email");
    console.log("🧾 Job found:", job?._id, job?.title);
    console.log("📄 Applications found:", applications.length);

    await Promise.allSettled(
  applications.map(async (app) => {
    app.status = "interview";
    app.interview = interview._id;
    await app.save();

    return sendInterviewEmail(app.applicant.email, {
      applicantName: app.applicant.name,
      jobTitle: job.title,
      companyName: job.company.name,
      interviewDate: interview.date,
      interviewTime: interview.timeRange,
      medium: interview.medium,
      meetingLink: interview.meetingLink,
      location: interview.location,
      instructions: interview.instructions,
    });
  })
);


    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
     throw error;
  }
};

/**
 * GET INTERVIEW by job
 
 */
// GET /api/admin/interview/job/:jobId
export const getInterviewByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const interviews = await Interview.find({ job: jobId })
      .populate("job", "title")
      .populate("company", "name")
      .sort({ date: 1 });

    // ✅ Always return 200
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**UPDATE INTERVIEW*/

export const updateInterviewSchedule = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL INTERVIEW
 * DELETE /interviews/:id
 */
export const cancelInterviewSchedule = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 🔁 Revert applications
    await JobApplication.updateMany(
      { interview: interview._id },
      {
        status: "applied",
        interview: null,
      }
    );
   const applications = await JobApplication.find({
      interview: interview._id,
    }).populate("applicant job");

    for (const app of applications) {
      app.status = "applied";
      app.interview = null;
      await app.save();

      await sendInterviewEmail(app.applicant.email, {
        type: "canceled",
        applicantName: app.applicant.name,
        jobTitle: app.job.title,
        companyName: app.job.company.name,
        message: "The interview has been canceled. We apologize for the inconvenience.",
      });
    }
    await interview.deleteOne();

    res.json({
      message: "Interview cancelled and applicants reverted to applied",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET interview by id
 */
// GET /api/admin/interview/interviews/:id
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("job", "title")
      .populate("company", "name");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
