import { Schema, model } from "mongoose";
const JobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  company: { type: String, required: true },
  salary: { type: Number, required: true },
  applyLink: { type: String, required: true },
  datePosted: { type: Date, default: Date.now },
  applyTill: { type: Date },
  isFeatured: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  jobType: {
    type: String,
    enum: ["Full Time", "Part Time", "Contract", "Internship"],
  },
  jobCategory: {
    type: String,
    enum: ["Engineering", "Finance", "Marketing", "Sales", "Other"],
  },
  jobLevel: {
    type: String,
    enum: ["Entry Level", "Mid-Level", "Senior Level", "Managerial"],
  },
});

const Job = model("Job", JobSchema);
export default Job;
