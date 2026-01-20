import Interview from "../../models/interviewScheduler.js";
import JobApplication from "../../models/jobApplication.js";
import Job from "../../models/jobs.js";
import { sendInterviewEmail } from "../../helpers/mailer.js";

/**
 * CREATE INTERVIEW
 * POST /jobs/:jobId/interviews
 */
export const scheduleInterview = async (req, res) => {
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
    const job = await Job.findById(jobId).populate("company", "name");

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
   
    await Promise.allSettled(
      applications.map(async (app) => {
        app.status = "interview";
        app.interview = interview._id;
        await app.save();

        await sendInterviewEmail(app.applicant.email, {
          type: "scheduled",
          applicantName: app.applicant.name,
          jobTitle: job.title,
          companyName: job.company.name, // ensure company is populated
          interviewDate: interview.date.toDateString(), // optional formatting
          interviewTime: {
            start: interview.timeRange.start,
            end: interview.timeRange.end,
          },
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
    const interview = await Interview.findById(req.params.id)
      .populate("job", "title")
      .populate("company", "name");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 1️⃣ Update interview
    Object.assign(interview, req.body); // merge updated fields
    await interview.save();
   

    // 2️⃣ Respond immediately
    res.json({ message: "Interview updated successfully", interview });

    // 3️⃣ Fetch all applications for this job
    const applications = await JobApplication.find({ interview: interview._id })
      .populate("applicant", "name email")
      .populate({ path: "job", populate: { path: "company", select: "name" } });

    // 4️⃣ Send update emails asynchronously
    if (applications.length > 0) {
      setImmediate(async () => {
        for (const app of applications) {
          try {
            await sendInterviewEmail(app.applicant.email, {
              type: "updated", // make sure this matches the template
              applicantName: app.applicant.name,
              jobTitle: app.job.title,
              companyName: app.job.company.name,
              interviewDate: interview.date.toDateString(),
              interviewTime: {
                start: interview.timeRange?.start,
                end: interview.timeRange?.end,
              },
              medium: interview.medium,
              meetingLink: interview.meetingLink,
              location: interview.location,
              instructions: interview.instructions,
              message:
                "The interview details have been updated. Please check the new schedule.",
            });
          } catch (err) {
          }
        }
      });
    } else {
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const cancelInterviewSchedule = async (req, res) => {

  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // 1️⃣ Fetch applications
    const applications = await JobApplication.find({ interview: interview._id })
      .populate("applicant")
      .populate({ path: "job", populate: { path: "company", select: "name" } });

    // 2️⃣ Revert applications
    await JobApplication.updateMany(
      { interview: interview._id },
      { status: "applied", interview: null }
    );

    // 3️⃣ Delete interview
    try {
      await interview.deleteOne();
      
    } catch (err) {
      
    }

    // 4️⃣ Respond immediately
    res.json({ message: "Interview cancelled successfully" });

    // 5️⃣ Send emails asynchronously
    if (applications.length > 0) {
      setImmediate(async () => {
        for (const app of applications) {
          try {
            await sendInterviewEmail(app.applicant.email, {
              type: "canceled",
              applicantName: app.applicant.name,
              jobTitle: app.job.title,
              companyName: app.job.company.name,
              message:
                "The interview has been canceled. We apologize for the inconvenience.",
            });
            
          } catch (err) {
          }
        }
      });
    } else {
    }
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
