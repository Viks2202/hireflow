const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: {
        values: ["fulltime", "parttime", "remote", "contract", "internship"],
        message: "Invalid job type"
      }
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: "0-1 years"
    },
    deadline: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    applicants: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Job = mongoose.model("Job", jobSchema)

module.exports = Job