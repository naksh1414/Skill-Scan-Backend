import Job from "../models/jobs.js";

export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, dateFilter = true } = req.query;
    const options = {
      isArchived: false,
      isDeleted: false,
    };
    if (!dateFilter) options.applyTill = { $gt: new Date() };
    const jobs = await Job.find(options)
      .sort({ datePosted: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(parseInt(limit));

    const totalCourses = await Job.countDocuments({});
    res.status(200).json({
      jobs,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    const options = {
      isArchived: false,
      isDeleted: false,
      _id: id,
    };
    const job = await Job.findOne(options);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { id } = req.query;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
