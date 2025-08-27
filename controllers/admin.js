import Job from "../models/jobs.js";
import User from "../models/user.js";
import Blog from "../models/blogs.js";
export const addJobs = async (req, res) => {
  const {
    title,
    description,
    location,
    company,
    salary,
    applyLink,
    applyTill,
    isFeatured,
    jobType,
    jobCategory,
    jobLevel,
  } = req.body;
  const job = new Job({
    title,
    description,
    location,
    company,
    salary: parseInt(salary),
    applyLink,
    applyTill,
    isFeatured,
    jobType,
    jobCategory,
    jobLevel,
  });
  await job.save();
  res.status(201).json(job);
};

export const checkAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ isAdmin: user.isAdmin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.isAdmin = true;
    await user.save();

    return res
      .status(200)
      .json({ message: "User has been made admin successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ isAdmin: true }).select(
      "fullName email created_at"
    );

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }

    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(400).json({ message: "User is not an admin" });
    }

    user.isAdmin = false;
    await user.save();

    return res.status(200).json({ message: "Admin role removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      thumbnail,
      summary,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let blog = await Blog.findOne({ slug });

    if (blog) {
      blog.title = title;
      blog.content = content;
      blog.thumbnail = thumbnail;
      blog.summary = summary;
      blog.seoTitle = seoTitle;
      blog.seoDescription = seoDescription;
      blog.seoKeywords = seoKeywords;
      await blog.save();
      return res.status(200).json(blog);
    } else {
      blog = new Blog({
        title,
        content,
        thumbnail,
        slug,
        summary,
        seoTitle,
        seoDescription,
        seoKeywords,
      });
      await blog.save();
      return res.status(201).json(blog);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
