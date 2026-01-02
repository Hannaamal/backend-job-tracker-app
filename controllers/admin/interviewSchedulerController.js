import Interview from "../../models/interviewScheduler.js";
import JobApplication from "../../models/jobApplication.js";

/**
 * Schedule Interview
 * POST /applications/:id/interview
 */
export const scheduleInterview = async (req, res) => {
  try {
    const applicationId = req.params.id;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const interview = await Interview.create({
      user: application.applicant,
      job: application.job,
      company: application.company,
      ...req.body,
    });

    application.interview = interview._id;
    application.status = "interview";
    await application.save();

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update Interview
 * PUT /interviews/:id
 */
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({ message: "Interview updated", interview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Cancel Interview
 * DELETE /interviews/:id
 */
export const cancelInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    await JobApplication.findOneAndUpdate(
      { interview: interview._id },
      {
        interview: null,
        status: "applied",
      }
    );

    await interview.deleteOne();

    res.json({
      message: "Interview cancelled and status reverted to applied",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
