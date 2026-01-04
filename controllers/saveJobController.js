// controllers/savedJobController.js
import SavedJob from "../models/saveJob.js";



// controllers/savedJobController.js
export const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.userData.userId })
      .populate({
        path: "job",
        select: "title location company jobType experienceLevel salaryRange",
        populate: { path: "company", select: "name location logo" }, // populate company
      })
      .sort({ createdAt: -1 }); // saved date

    res.status(200).json(savedJobs); // `savedJobs[i].createdAt` is the saved date
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};



// SAVE a job
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if already saved
    const exists = await SavedJob.findOne({ user: req.userData.userId, job: jobId });
    if (exists) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const savedJob = new SavedJob({
      user: req.userData.userId,
      job: jobId,
    });

    await savedJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: "Failed to save job", error: err.message });
  }
};

// REMOVE a saved job
export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    await SavedJob.findOneAndDelete({ user: req.userData.userId, job: jobId });

    res.status(200).json({ message: "Saved job removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove saved job", error: err.message });
  }
};
